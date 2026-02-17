# 📦 Publishing to NPM

Guía para publicar `@mauro25qe/claude-code-setup` a npm.

---

## 📋 Pre-requisitos

1. **Cuenta en npmjs.com**
   - Crear cuenta en https://www.npmjs.com/signup
   - Verificar email

2. **Login en npm CLI**
   ```bash
   npm login
   # Te pedirá: username, password, email, OTP (si tenés 2FA)
   ```

3. **Verificar login**
   ```bash
   npm whoami
   # Debe mostrar: venticinquemauro
   ```

---

## 🧪 Testing Antes de Publicar

### 1. Test Local con npm link

```bash
# En el directorio del proyecto
npm link

# Ahora podés usar el comando globalmente
claude-setup --help
claude-setup --dry-run --global-only --yes

# Cuando termines de testear
npm unlink -g @mauro25qe/claude-code-setup
```

### 2. Test del Package con npm pack

```bash
# Crear tarball local (simula lo que se publicaría)
npm pack

# Esto crea: venticinquemauro-claude-code-setup-1.0.0.tgz

# Instalar el tarball en otro directorio para testear
cd /tmp
npm install /path/to/venticinquemauro-claude-code-setup-1.0.0.tgz
npx claude-code-setup --version
```

### 3. Ver qué archivos se incluirán

```bash
npm pack --dry-run
# Muestra lista de archivos que se publicarán
```

---

## 🚀 Publicar a NPM

### Primera Publicación

```bash
# 1. Verificar que todo está OK
npm run test  # Corre el dry-run test

# 2. Publicar (scoped packages requieren --access public)
npm publish --access public
```

### Publicaciones Subsecuentes

```bash
# 1. Actualizar versión
npm version patch   # 1.0.0 → 1.0.1
# o
npm version minor   # 1.0.0 → 1.1.0
# o
npm version major   # 1.0.0 → 2.0.0

# 2. Publicar
npm publish --access public

# 3. Push tags a GitHub
git push --follow-tags
```

---

## 🔄 Workflow Automatizado con GitHub Actions

### Setup (Una sola vez)

1. **Crear npm token:**
   - Ir a https://www.npmjs.com/settings/{username}/tokens
   - Create New Token → Automation
   - Copiar el token

2. **Agregar token a GitHub Secrets:**
   - Ir a repo → Settings → Secrets and variables → Actions
   - New repository secret
   - Name: `NPM_TOKEN`
   - Value: (pegar el token)

3. **Crear workflow:** `.github/workflows/publish-npm.yml`

```yaml
name: Publish to NPM

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: npm ci

      - name: Publish to NPM
        run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Publicar con GitHub Actions

```bash
# 1. Crear tag
git tag v1.0.1
git push origin v1.0.1

# GitHub Actions automáticamente:
# - Detecta el tag
# - Instala dependencias
# - Publica a npm
```

---

## 📊 Post-Publicación

### Verificar Publicación

```bash
# Ver en npm
npm view @mauro25qe/claude-code-setup

# Testear instalación
npx @mauro25qe/claude-code-setup --version
```

### Verificar en npm Website

https://www.npmjs.com/package/@mauro25qe/claude-code-setup

### Actualizar Badge en README

```markdown
[![npm version](https://img.shields.io/npm/v/@mauro25qe/claude-code-setup.svg)](https://www.npmjs.com/package/@mauro25qe/claude-code-setup)
[![npm downloads](https://img.shields.io/npm/dm/@mauro25qe/claude-code-setup.svg)](https://www.npmjs.com/package/@mauro25qe/claude-code-setup)
```

---

## 🔧 Mantenimiento

### Deprecar Versión

```bash
npm deprecate @mauro25qe/claude-code-setup@1.0.0 "Critical bug, use 1.0.1+"
```

### Unpublish (Solo primeras 72 horas)

```bash
npm unpublish @mauro25qe/claude-code-setup@1.0.0
```

### Actualizar Documentación

Después de publicar, actualizar:
- README.md (badges, instrucciones)
- CHANGELOG.md (changelog de cambios)
- GitHub Release notes

---

## 🚨 Troubleshooting

### Error: 403 Forbidden

```bash
# Verificar login
npm whoami

# Re-login
npm logout
npm login
```

### Error: Package name already exists

```bash
# Usar scoped package
# Ya estamos usando: @mauro25qe/claude-code-setup ✓
```

### Error: Too many files

```bash
# Verificar .npmignore
npm pack --dry-run | wc -l
# Debe ser < 100 archivos idealmente
```

---

## 📈 Analytics

Ver estadísticas en:
- https://www.npmjs.com/package/@mauro25qe/claude-code-setup
- https://npm-stat.com/charts.html?package=@mauro25qe/claude-code-setup

---

## 🎯 Checklist Antes de Publicar

- [ ] Tests pasan: `npm run test`
- [ ] Version actualizada en package.json
- [ ] README actualizado
- [ ] .npmignore configurado
- [ ] Templates están en templates/
- [ ] npm pack --dry-run muestra solo archivos necesarios
- [ ] npm link funciona localmente
- [ ] npm whoami confirma usuario correcto
- [ ] Scoped package con --access public

---

**¡Listo para publicar!** 🎉

```bash
npm publish --access public
```
