const DEFAULT_TEMPLATE = `CONTRATO DE TRABAJO

Entre ARCA LTDA y {{nombre}} {{apellido}} (CI: {{ci}}), se acuerda lo siguiente:

1. Fecha de inicio: {{fechaIngreso}}
2. Salario mensual: Bs. {{salario}}
3. Periodo de prueba: {{periodoPrueba}} dias

Firmado en La Paz, Bolivia.
`;

const TEMPLATES = {
  default: DEFAULT_TEMPLATE,
};

const render = (templateName, vars) => {
  const tpl = TEMPLATES[templateName] || TEMPLATES.default;
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const v = vars[key];
    return v === undefined || v === null ? '' : String(v);
  });
};

module.exports = { render, TEMPLATES };
