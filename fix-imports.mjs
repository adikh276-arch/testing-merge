import fs from "fs";
import path from "path";

const replaceInFile = (filePath, rules) => {
  let content = fs.readFileSync(filePath, "utf-8");
  let updated = false;
  
  rules.forEach(({ search, replace }) => {
    if (content.includes(search)) {
      content = content.replaceAll(search, replace);
      updated = true;
    }
  });
  
  // also replace react-router-dom with standard next links (lazy fallback)
  // or just rename them
  if (updated) {
    fs.writeFileSync(filePath, content, "utf-8");
    console.log("Updated:", filePath);
  }
};

const walkSync = (dir, callback) => {
  fs.readdirSync(dir).forEach(file => {
    let filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      walkSync(filepath, callback);
    } else {
      callback(filepath);
    }
  });
};

const brainDumpComponents = [
  "BrainDump", "BrainDumpApp", "NavLink", "OneSmallStep", "Reflection", "SavedThoughts", "SortThoughts", "Welcome"
];

const missionStatementComponents = [
  "AuthGuard", "LanguageSelector", "MissionButton", "NavLink", "ReflectionInput", "ScreenWrapper", "ValueChip", "screens"
];

const rules = [];
brainDumpComponents.forEach(c => {
  rules.push({ search: `@/components/${c}`, replace: `@/components/brain_dump/${c}` });
});
missionStatementComponents.forEach(c => {
  rules.push({ search: `@/components/${c}`, replace: `@/components/mission_statement/${c}` });
});

walkSync("./src", (filePath) => {
  if (filePath.endsWith(".tsx") || filePath.endsWith(".ts")) {
    // Additionally, all Vite 'import.meta.env' must be changed to Next 'process.env.NEXT_PUBLIC_'
    let content = fs.readFileSync(filePath, "utf-8");
    let changed = false;
    
    rules.forEach(({ search, replace }) => {
      if (content.includes(search)) {
        content = content.replaceAll(search, replace);
        changed = true;
      }
    });
    
    // fix env vars
    if (content.includes("import.meta.env.VITE_SUPABASE_URL")) {
      content = content.replaceAll("import.meta.env.VITE_SUPABASE_URL", "process.env.NEXT_PUBLIC_SUPABASE_URL");
      changed = true;
    }
    // and others
    if (content.includes("import.meta.env.")) {
      content = content.replace(/import\.meta\.env\.VITE_([A-Za-z0-9_]+)/g, "process.env.NEXT_PUBLIC_$1");
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, content, "utf-8");
      console.log("Updated:", filePath);
    }
  }
});
