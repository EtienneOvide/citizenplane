# CitizenPlane Technical Test


## Table of Contents

- [Getting Started](#getting-started)
- [Main Libraries](#main-libraries)
- [Development Tools](#development-tools)

## Getting Started

**Node version**: 24.11.1

**Package manager**: npm

Copy `.env.example`, rename it to `.env`, and update values accordingly.

Install dependencies:

```bash
npm install
```

Run the dev server on [http://localhost:3000/](http://localhost:3000/) (can be updated in vite.config.ts):

```bash
npm run dev
```

Create a build:

```bash
npm run build
```

Preview build:

```bash
npm run preview
```

Run tests:

```bash
npm run test
```

Run tests with UI:

```bash
npm run test:ui
```

Run tests in watch mode:

```bash
npm run test:watch
```

Lint code:

```bash
npm run lint
```

Automatically fix lint issues:

```bash
npm run lint:fix
```

Format code:

```bash
npm run format
```

## Main Libraries

| Library               | Purpose                   | Link                                                                                 |
| --------------------- | ------------------------- | ------------------------------------------------------------------------------------ |
| TanStack Router       | Routing                   | [TanStack Router](https://tanstack.com/router/latest)                                |
| TanStack Query        | Data fetching and caching | [TanStack Query](https://tanstack.com/query/latest)                                  |
| Zustand               | State management          | [Zustand](https://zustand-demo.pmnd.rs/)                                             |
| React Hook Form       | Form handling             | [React Hook Form](https://react-hook-form.com/)                                      |
| Zod                   | Schema validation         | [Zod](https://zod.dev/)                                                              |
| React Aria Components | Primitive components      | [React Aria Components](https://react-spectrum.adobe.com/react-aria/components.html) |
| Lucide React          | Icon library              | [Lucide React](https://lucide.dev/)                                                  |

## Development Tools

| Tool            | Purpose         | Link                                            |
| --------------- | --------------- | ----------------------------------------------- |
| Vite            | Build tool      | [Vite](https://vitejs.dev/)                     |
| TypeScript      | Type safety     | [TypeScript](https://www.typescriptlang.org/)   |
| ESLint          | Linting         | [ESLint](https://eslint.org/)                   |
| Prettier        | Code formatting | [Prettier](https://prettier.io/)                |
| Vitest          | Testing         | [Vitest](https://vitest.dev/)                   |
| Testing Library | UI testing      | [Testing Library](https://testing-library.com/) |
| Sass            | Styling         | [Sass](https://sass-lang.com/)                  |
