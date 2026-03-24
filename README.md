# MacroMeal 🍳

Portions ajustées automatiquement selon tes macros. Zéro prise de tête.

## Déployer sur Vercel

### Option 1 — Via GitHub (recommandé)

1. Crée un repo GitHub et pousse ce dossier :
   ```bash
   cd macromeal
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/TON-USER/macromeal.git
   git push -u origin main
   ```

2. Va sur [vercel.com](https://vercel.com), connecte ton compte GitHub
3. Clique **"Add New Project"** → sélectionne le repo `macromeal`
4. Vercel détecte automatiquement Next.js → clique **Deploy**
5. C'est en ligne ! 🎉

### Option 2 — Via Vercel CLI

```bash
npm i -g vercel
cd macromeal
vercel
```

## Développement local

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000)
