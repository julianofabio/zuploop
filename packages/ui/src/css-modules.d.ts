// Tipos dos CSS Modules: cada classe vira uma string.
declare module "*.module.css" {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}
