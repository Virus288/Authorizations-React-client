// eslint-disable-next-line max-classes-per-file
import type { ETokenNames } from '../enums';
import { ESameSiteParams } from '../enums';

class CookieGenerator {
  private readonly _value: string;

  private readonly _name: string;

  private _expires: number | undefined;

  private _path: string | undefined;

  private _sameSite: ESameSiteParams | undefined;

  private _secure: boolean | undefined;

  constructor(value: string, name: string) {
    this._value = value;
    this._name = name;
  }

  private get pathValue(): string | undefined {
    return this._path;
  }

  private set pathValue(value: string | undefined) {
    this._path = value;
  }

  private get sameSiteValue(): ESameSiteParams | undefined {
    return this._sameSite;
  }

  private set sameSiteValue(value: ESameSiteParams | undefined) {
    this._sameSite = value;
  }

  private get secureValue(): boolean | undefined {
    return this._secure;
  }

  private set secureValue(value: boolean | undefined) {
    this._secure = value;
  }

  private get expiresValue(): number | undefined {
    return this._expires;
  }

  private set expiresValue(value: number | undefined) {
    this._expires = value;
  }

  private get value(): string {
    return this._value;
  }

  private get name(): string {
    return this._name;
  }

  expires(date: number): this {
    this.expiresValue = date;
    return this;
  }

  path(path: string): this {
    this.pathValue = path;
    return this;
  }

  sameSite(value: ESameSiteParams): this {
    this.sameSiteValue = value;
    return this;
  }

  secure(value: boolean): this {
    this.secureValue = value;
    return this;
  }

  create(): void {
    let domain = import.meta.env.VITE_API_HOME as string;

    const isIp =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (domain.includes('https://')) {
      domain = `${domain.split('https://')[1]}`;
    } else if (domain.includes('http://')) {
      domain = `${domain.split('http://')[1]}`;
    }

    if (domain.includes(':')) {
      [domain] = domain.split(':');
    }

    if (!isIp.test(domain)) {
      domain = `.${domain}`;
    }

    document.cookie =
      `${this.name}=${this.value};` +
      `${this.expiresValue ? `expires=${new Date(Date.now() + this.expiresValue * 1000).toString()};` : ''}` +
      `${this.secureValue ? 'Secure;' : ''}` +
      `${this.sameSiteValue ? `SameSite=${this.sameSiteValue};` : ''}` +
      `domain=${domain}` +
      `${this.pathValue ? `path=${this.pathValue};` : ''}`;
  }
}

export default class Cookies {
  getToken(target: ETokenNames): string | undefined {
    return document.cookie
      .split('; ')
      .find((c) => c.startsWith(`${target}=`))
      ?.split('=')[1];
  }

  removeToken(target: string): void {
    new CookieGenerator('', target).expires(0).create();
  }

  addLoginToken(token: string, ttl: number): void {
    new CookieGenerator(token, 'auth.uid').secure(false).expires(ttl).sameSite(ESameSiteParams.Strict).create();
  }

  addRefreshToken(token: string, ttl: number): void {
    new CookieGenerator(token, 'auth.ref').secure(false).expires(ttl).sameSite(ESameSiteParams.Strict).create();
  }
}
