import React, { ChangeEvent, FormEvent, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { getData } from './utils/api';
import FormInput from './components/form-input/form-input';

type User = {
  id: number,
  name: string,
  email: string,
  password: string,
}

const defaultFormFields = {
  email: '',
  password: '',
};

function App() {

  const [user, setUser] = useState<User | null>();
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields;

  const resetFormFields = () => {
    return (
      setFormFields(defaultFormFields)
    );
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormFields({ ...formFields, [name]: value })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const res: User = await getData(
        'http://localhost:4000/api/login', email, password
      )
      console.log(res);
      resetFormFields()
      setUser(res);
    } catch (error) {
      alert('User Sign In Failed');
    }
  };

  const reload = () => {
    setUser(null);
    resetFormFields()
  };

  return (
    <div className="App">
      <header className="App-header">
      <h1>
          { user && `Welcome! ${user.name}`}
        </h1>
        <h2>Sign In</h2>
          <form onSubmit={handleSubmit}>
            <FormInput
              label="Email"
              type="email"
              required
              name="email"
              value={email}
              onChange={handleChange}
            />
            <FormInput
              label="Password"
              type='password'
              required
              name='password'
              value={password}
              onChange={handleChange}
            />
            <div className="button-group">
              <button type="submit">Sign In</button>
              <span>
                <button type="button" onClick={reload}>Clear</button>
              </span>
            </div>
          </form>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
