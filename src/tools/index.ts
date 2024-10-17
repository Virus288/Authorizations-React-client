import Cookies from './cookies';

const generateRandomName = (max = 20): string => {
  const vocabulary = 'ABCDEFGHIJKLMNOUPRSTUWZabcdefghijklmnouprstuwz';
  let name = '';
  for (let x = 0; x < max; x++) {
    name += vocabulary[Math.floor(Math.random() * vocabulary.length)];
  }
  return name;
};

export { Cookies, generateRandomName };
