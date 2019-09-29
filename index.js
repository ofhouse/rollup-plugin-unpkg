const path = require('path');
const readPkg = require('read-pkg');
const { walk } = require('estree-walker');
const MagicString = require('magic-string');
const padStr = str => `'${str}'`;

module.exports = ({
  transform = (name, version) => `https://unpkg.com/${name}@${version}?type=module`,
} = {}) => {
  const cache = {};
  let pkg;

  return {
    name: 'unpkg',
    options(opts) {
      // Read the package.json from the project we are building
      const projectPath = path.dirname(opts.input);
      pkg = readPkg.sync({ cwd: projectPath });

      let deps = (pkg && pkg.dependencies) || {};
      Object.entries(deps).forEach(([name, version]) => {
        cache[name] = transform(name, version);
      });

      let external = Object.values(cache);
      if (Array.isArray(opts.external)) {
        external = Array.from(new Set(opts.external.concat(external)));
      }
      return Object.assign({}, opts, { external });
    },
    transform(code, id) {
      const ast = this.parse(code);
      const magicString = new MagicString(code);
      walk(ast, {
        enter(node, parent) {
          if (node.type === 'Literal' && parent.type === 'ImportDeclaration') {
            if (cache[node.value])
              magicString.overwrite(node.start, node.end, padStr(cache[node.value]), {
                storeName: false,
              });
            return node;
          }
        },
      });
      return {
        code: magicString.toString(),
        map: magicString.generateMap(),
      };
    },
  };
};
