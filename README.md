# Seeder

Seeder is a tiny, deterministic data generator library. It provides essential seeding utilities without the bloat of massive default datasets.

It focuses on:
- **Zero Dependencies**: Lightweight and tree-shakeable.
- **Micro-Seeder Architecture**: Load only the specific data files you need (e.g. `seeds/geo/cities.json`).
- **Deterministic**: Fully seedable PRNG (Mulberry32) for reproducible tests.

> Early development. API stable for v0.1.0.

Maintained by **toolsbee.com** · https://www.toolsbee.com

---

## Install

```bash
npm install @toolsbee/seeder
```

---

## Quick Start

```ts
import { Seeder } from "@toolsbee/seeder";

// 1. Core Primitives (No external data needed)
const rng = new Seeder(12345); // Seeded for reproducibility

rng.int(1, 100);
// 8

rng.pick(["A", "B", "C"]);
// "B"

rng.uuid();
// "63f6a8e1-..."


// 2. Using Bundled Seeds (Import only what you need)
import names from "@toolsbee/seeder/seeds/people/names.json";
import cities from "@toolsbee/seeder/seeds/geo/cities.json";

rng.use(names);
rng.use(cities);

// Now you can pick from the loaded data
const user = `${rng.pick(rng.data.firstNames)} from ${rng.pick(rng.data.cities)}`;
// "Alice from New York"
```

---

## Core API

### 1. new Seeder(seed?)

Create a new generator instance.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `seed` | `number \| string` | `Date.now()` | The seed for the PRNG. Identical seeds produce identical results. |

```ts
const rng1 = new Seeder("test");
const rng2 = new Seeder("test");

rng1.int(0, 100) === rng2.int(0, 100); // true
```

### 2. Primitives

Basic random value generation.

| Method | Signature | Description |
| :--- | :--- | :--- |
| `int` | `(min, max)` | Random integer between min and max (inclusive). |
| `float` | `(min, max)` | Random float between min and max. |
| `bool` | `(probability?)` | Boolean (default 0.5 for 50% chance). |

```ts
rng.int(1, 10);     // 7
rng.float(0, 1);    // 0.453...
rng.bool(0.1);      // true (10% chance)
```

### 3. Collections

Helpers for working with arrays.

| Method | Signature | Description |
| :--- | :--- | :--- |
| `pick` | `<T>(array)` | Return one random item from the array. |
| `sample` | `<T>(array, count)` | Return `count` unique random items. |
| `shuffle` | `<T>(array)` | Return a new shuffled copy of the array. |

```ts
rng.pick(["Apple", "Banana", "Cherry"]);  // "Banana"
rng.sample([1, 2, 3, 4, 5], 2);           // [4, 1]
```

### 4. Identity

Generate identifiers.

| Method | Signature | Description |
| :--- | :--- | :--- |
| `uuid` | `()` | Generate a UUID v4 string. |
| `id` | `(length?)` | Generate a random alphanumeric string (default length 21). |

```ts
rng.uuid(); // "3d0ca220-4208-412e-a229-370557d1175c"
rng.id(10); // "X7aBc91zQl"
```

### 5. Extensibility

Inject your own data or used bundled seeds.

| Method | Signature | Description |
| :--- | :--- | :--- |
| `use` | `(bundle)` | Merge a dataset into the registry. |
| `data` | `[read-only]` | Access the loaded data registry. |

```ts
const myData = { planets: ["Mars", "Venus"] };
rng.use(myData);

console.log(rng.pick(rng.data.planets)); // "Mars"
```

---

## Bundled Seeds

The library comes with optional seed files. You must import them individually. This architecture keeps your bundle size tiny by default.

**Available Categories:**

- **Commerce** (`seeds/commerce/`)
  - `products.json`, `companies.json`
- **Design** (`seeds/design/`)
  - `colors.json`
- **Geo** (`seeds/geo/`)
  - `cities.json`, `countries.json`
- **Nature** (`seeds/nature/`)
  - `animals.json`
- **People** (`seeds/people/`)
  - `names.json`, `users.json`
- **Tech** (`seeds/tech/`)
  - `stack.json`

**Seed Builder:**
- Seed Builder is a tool to generate seed files from your data. Coming soon. 
---

## Browser Usage

### Basic Example

```html
<!doctype html>
<html>
  <body>
    <div id="out">Loading...</div>

    <script type="module">
      import { Seeder } from "https://cdn.jsdelivr.net/npm/@toolsbee/seeder/dist/index.js";
      
      const rng = new Seeder();
      
      // Load one seed file
      fetch("https://cdn.jsdelivr.net/npm/@toolsbee/seeder/seeds/geo/cities.json")
        .then(res => res.json())
        .then(cities => {
            rng.use(cities);
            document.getElementById("out").textContent = 
                `Hello from ${rng.pick(rng.data.cities)}`;
        });
    </script>
  </body>
</html>
```

### Advanced Example (Multiple Files & Arrays)

```html
<!doctype html>
<html>
  <body>
    <div id="user-info">Loading...</div>

    <script type="module">
      import { Seeder } from "https://cdn.jsdelivr.net/npm/@toolsbee/seeder/dist/index.js";
      
      const rng = new Seeder();

      // Load multiple seed files in parallel
      Promise.all([
        fetch("https://cdn.jsdelivr.net/npm/@toolsbee/seeder/seeds/people/names.json").then(r => r.json()),
        fetch("https://cdn.jsdelivr.net/npm/@toolsbee/seeder/seeds/geo/cities.json").then(r => r.json()),
        fetch("https://cdn.jsdelivr.net/npm/@toolsbee/seeder/seeds/design/colors.json").then(r => r.json())
      ]).then(([names, cities, colors]) => {
          
          // Merge all datasets into the seeder
          rng.use(names);  // contains firstNames, lastNames
          rng.use(cities); // contains cities
          rng.use(colors); // contains colors
          
          // Pick from multiple different arrays to compose a result
          const first = rng.pick(rng.data.firstNames);
          const last = rng.pick(rng.data.lastNames);
          const city = rng.pick(rng.data.cities);
          const favColor = rng.pick(rng.data.colors);

          document.getElementById("user-info").innerHTML = 
              `<b>${first} ${last}</b> lives in <b>${city}</b> and loves <span style="color:${favColor}">${favColor}</span>.`;
      });
    </script>
  </body>
</html>
```

---

## Design Goals

* **Tiny:** Minimal footprint, tree-shakeable.
* **Granular:** Import only the data you need. 
* **Zero-Deps:** No external dependencies.
* **Strict:** Built with strict TypeScript settings.

---

## License

MIT
