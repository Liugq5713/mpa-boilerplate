const base = './src/pages/'
module.exports = function (plop) {
  // controller generator
  plop.setGenerator('controller', {
    description: 'application controller logic',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'your page name:'
      }
    ],
    actions: [
      {
        type: 'add',
        path: `${base}{{name}}/index.js`,
        templateFile: 'plop-templates/script.hbs'
      },
      {
        type: 'add',
        path: `${base}{{name}}/index.html`,
        templateFile: 'plop-templates/html.hbs'
      },
      {
        type: 'add',
        path: `${base}{{name}}/style.less`,
        templateFile: 'plop-templates/style.hbs'
      }
    ]
  })
}
