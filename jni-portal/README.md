# default

## Project setup

```
# yarn
yarn

# npm
npm install

# pnpm
pnpm install
```

### Compiles and hot-reloads for development

```
# yarn
yarn dev

# npm
npm run dev

# pnpm
pnpm dev
```

### Compiles and minifies for production

```
# yarn
yarn build

# npm
npm run build

# pnpm
pnpm build
```

### Customize configuration

See [Configuration Reference](https://vitejs.dev/config/).

# local installation
npm install
npm run dev
url: http://localhost:3001

# Production mode (docker image):
-> npm install
-> npm run build
-> docker build -t eclipsebasyx/assgui:2.0.0-SNAPSHOT .
-> docker run -p 3001:3001 eclipsebasyx/assgui:2.0.0-SNAPSHOT
