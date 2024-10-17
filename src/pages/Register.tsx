import React, { FormEvent } from 'react';
import { register } from '../controllers/register.ts';
import { IRegisterForm } from '../types';

const onSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const target = e.target as IRegisterForm;

  const login = target.login.value;
  const email = target.email.value;
  const password = target.password.value;

  register(login, password, email).then(() => {
    console.log('Registered');
  }).catch(err => {
    console.log('Got err');
    console.log(err);
  });
};

const Register: React.FC = () => {
  return (
    <div>
      <form onSubmit={(e) => onSubmit(e)}>
        <input
          id="login"
          placeholder="user name"
          type="text"
        />
        <div>
          <input
            id="email"
            placeholder="email"
            type="email"
          />
          <input
            id="password"
            placeholder="password"
            type="password"
          />
          <input
            id="password2"
            placeholder="confirm password"
            type="password"
          />
        </div>
        <button
          type="submit"
        >
          Create Account
        </button>
      </form>
    </div>
  )
    ;
};

export default Register;
