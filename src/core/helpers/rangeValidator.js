const rangeValidator = value => (!/\d/.test(String(value)) || value==='-' || /-{2,}/.test(String(value)));

export default rangeValidator;
