import React, { Component } from "react";
import { Navigate, useNavigate, useNavigation } from "react-router-dom";
import jwt_decode from "jwt-decode";

function navigate(link) {
  const navigate = useNavigate();
  navigate(link);
}

// Przykładowa implementacja funkcji loginUser
async function loginUser(email, password) {
  try {
    // Tutaj możesz wykonać zapytanie do serwera lub inną logikę logowania
    // Możesz użyć np. fetch do wysłania żądania do serwera, aby zweryfikować dane logowania.
    // Jeśli logowanie powiedzie się, możesz zwrócić odpowiednią wartość lub token dostępowy.
    // W przeciwnym razie rzuć wyjątek lub zwróć wartość oznaczającą niepowodzenie logowania.

    // Przykład użycia fetch:
    const response = await fetch("http://localhost:3000/api/user/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.status === 200) {
      // Logowanie powiodło się
      const json = await response.json();
      localStorage.setItem("token", json.token);
      console.log(jwt_decode(json.token));
      localStorage.setItem(
        "userName",
        JSON.stringify(jwt_decode(json.token).login)
      );
      return true;
    } else {
      // Logowanie nie powiodło się
      return false;
    }
  } catch (error) {
    console.error("Błąd logowania:", error);
    return false;
  }
}

async function registerUser(name, email, password) {
  try {
    // Tutaj możesz wykonać zapytanie do serwera lub inną logikę logowania
    // Możesz użyć np. fetch do wysłania żądania do serwera, aby zweryfikować dane logowania.
    // Jeśli logowanie powiedzie się, możesz zwrócić odpowiednią wartość lub token dostępowy.
    // W przeciwnym razie rzuć wyjątek lub zwróć wartość oznaczającą niepowodzenie logowania.

    // Przykład użycia fetch:
    const response = await fetch("http://localhost:3000/api/user/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.status === 200) {
      // Logowanie powiodło się
      return true;
    } else {
      // Logowanie nie powiodło się
      return false;
    }
  } catch (error) {
    console.error("Błąd logowania:", error);
    return false;
  }
}

// ------------------------------------------------------------------------------------------------------------------

class Intro extends Component {
  constructor() {
    super();
    this.state = {
      registration: {
        name: "",
        email: "",
        password: "",
      },
      login: {
        email: "",
        password: "",
      },
      isRegistering: false,
    };
  }

  handleRegistrationChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      registration: {
        ...prevState.registration,
        [name]: value,
      },
    }));
  };

  handleLoginChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      login: {
        ...prevState.login,
        [name]: value,
      },
    }));
  };

  handleRegistrationSubmit = async (event) => {
    event.preventDefault();
    // Tutaj można dodać kod do przetwarzania formularza rejestracji
    console.log("Rejestracja - E-mail:", this.state.registration.email);
    console.log("Rejestracja - Hasło:", this.state.registration.password);

    const registerSuccessful = await registerUser(
      this.state.registration.name,
      this.state.registration.email,
      this.state.registration.password
    );
    if (registerSuccessful) {
      this.props.navigate("/");
    }
  };

  handleLoginSubmit = async (event) => {
    event.preventDefault();
    // Tutaj można dodać kod do przetwarzania formularza logowania
    console.log("Logowanie - E-mail:", this.state.login.email);
    console.log("Logowanie - Hasło:", this.state.login.password);

    const loginSuccessful = await loginUser(
      this.state.login.email,
      this.state.login.password
    );
    if (loginSuccessful) {
      this.props.navigate("/monthlyBudget");
    }
  };

  toggleRegistering = () => {
    this.setState((prevState) => ({
      isRegistering: !prevState.isRegistering,
    }));
  };

  render() {
    return (
      <div className="intro">
        <div>
          <h1>
            Zapanuj nad <span className="accent">twoimi pieniędzmi!</span>
          </h1>
          <p>
            Budżet osobisty jest sekretem do finansowej wolności! Zacznij już
            dziś!
          </p>
          <div className="loginAndRegistrationForm">
            {this.state.isRegistering ? (
              <div>
                <h2>Rejestracja</h2>
                <form onSubmit={this.handleRegistrationSubmit}>
                  <label htmlFor="registration-email">Imię :</label>
                  <input
                    type="name"
                    id="name"
                    name="name"
                    placeholder="Podaj swoje imię"
                    value={this.state.registration.name}
                    onChange={this.handleRegistrationChange}
                    required
                  />
                  <label htmlFor="registration-email">E-mail:</label>
                  <input
                    type="email"
                    id="registration-email"
                    name="email"
                    placeholder="Podaj e-mail"
                    value={this.state.registration.email}
                    onChange={this.handleRegistrationChange}
                    required
                  />
                  <label htmlFor="registration-password">Hasło:</label>
                  <input
                    type="password"
                    id="registration-password"
                    name="password"
                    placeholder="Podaj hasło"
                    value={this.state.registration.password}
                    onChange={this.handleRegistrationChange}
                    required
                  />
                  <button type="submit" className="btn btn--dark">
                    Zarejestruj się
                  </button>
                </form>
                <p>
                  Masz już konto?{" "}
                  <span onClick={this.toggleRegistering}>Zaloguj się</span>
                </p>
              </div>
            ) : (
              <div>
                <h2>Logowanie</h2>
                <form onSubmit={this.handleLoginSubmit}>
                  <label htmlFor="login-email">E-mail:</label>
                  <input
                    type="email"
                    id="login-email"
                    name="email"
                    placeholder="Podaj e-mail"
                    value={this.state.login.email}
                    onChange={this.handleLoginChange}
                    required
                  />
                  <label htmlFor="login-password">Hasło:</label>
                  <input
                    type="password"
                    id="login-password"
                    name="password"
                    placeholder="Podaj hasło"
                    value={this.state.login.password}
                    onChange={this.handleLoginChange}
                    required
                  />
                  <button type="submit" className="btn btn--dark">
                    Zaloguj się
                  </button>
                </form>
                <p>
                  Nie masz jeszcze konta?{" "}
                  <span onClick={this.toggleRegistering}>Zarejestruj się</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export function IntroWithRouter(props) {
  const navigate = useNavigate();
  return <Intro navigate={navigate}></Intro>;
}

export default Intro;
