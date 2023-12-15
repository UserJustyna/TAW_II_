import PasswordDAO from "../DAO/passwordDAO";
import TokenDAO from "../DAO/tokenDAO";
import UserDAO from "../DAO/userDAO";
import applicationException from "../service/applicationException";
import sha1 from "sha1";

//zarządza użytkownikami
function create(context) {
  function hashString(password) {
    return sha1(password);
  }
  //Autoryzuje użytkownika na podstawie nazwy użytkownika(lub adresu e-mail) i hasła.
  async function authenticate(name, password) {
    let userData;
    console.log(name, password);
    const user = await UserDAO.getByEmailOrName(name);
    if (!user) {
      throw applicationException.new(
        applicationException.UNAUTHORIZED,
        "User with that email does not exist"
      );
    }
    userData = await user;
    await PasswordDAO.authorize(user.id, hashString(password));
    const token = await TokenDAO.create(userData);
    return getToken(token);
  }

  function getToken(token) {
    return { token: token.value };
  }
  //Tworzy nowego użytkownika lub aktualizuje istniejącego.
  async function createNewOrUpdate(userData) {
    const user = await UserDAO.createNewOrUpdate(userData);
    if (await userData.password) {
      return await PasswordDAO.createOrUpdate({
        userId: user.id,
        password: hashString(userData.password),
      });
    } else {
      return user;
    }
  }
  //Usuwa sesję użytkownika.
  async function removeHashSession(userId) {
    return await TokenDAO.remove(userId);
  }

  return {
    authenticate: authenticate,
    createNewOrUpdate: createNewOrUpdate,
    removeHashSession: removeHashSession,
  };
}

export default {
  create: create,
};
