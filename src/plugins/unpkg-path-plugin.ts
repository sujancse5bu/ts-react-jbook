import * as esbuild from 'esbuild-wasm'

export const unpkgPathPlugin = () => ({
  name: 'unpkg-path-plugin',
  setup(build: esbuild.PluginBuild) {
    // handle root entry file of index.js
    build.onResolve({ filter: /(^index\.js$)/ }, () => ({ path: 'index.js', namespace: 'a' }))
    
    // handle relative paths in a module
    build.onResolve({ filter: /^\.+\// }, (args) => ({
      namespace: 'a',
      path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/').href
    }))

    // handle main file of a module
    build.onResolve({ filter: /.*/ }, (args: any) => ({
      namespace: 'a',
      path: `https://unpkg.com/${args.path}`
    }))
  }
})
