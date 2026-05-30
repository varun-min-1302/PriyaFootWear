import { seedProducts } from '../src/data/seedProducts.ts';

function runValidation() {
  console.log("Running Dry Run Validation...\n");
  
  let invalidCount = 0;
  const missingFieldsTotal = new Set();
  const invalidFieldsTotal = new Set();
  const schemaMismatchesTotal = new Set();

  const requiredFields = ['name', 'slug', 'description', 'price', 'category', 'sizes', 'colors', 'images'];
  
  seedProducts.forEach((product, index) => {
    const missing = [];
    const mismatches = [];
    
    // Check required fields
    requiredFields.forEach(field => {
      if (product[field] === undefined || product[field] === null) {
        missing.push(field);
        missingFieldsTotal.add(field);
      }
    });

    // Check schema types
    if (typeof product.name !== 'string') mismatches.push('name must be string');
    if (typeof product.slug !== 'string') mismatches.push('slug must be string');
    if (typeof product.description !== 'string') mismatches.push('description must be string');
    if (typeof product.price !== 'number') mismatches.push('price must be number');
    if (typeof product.category !== 'string') mismatches.push('category must be string');
    if (!Array.isArray(product.sizes)) mismatches.push('sizes must be array');
    if (!Array.isArray(product.colors)) mismatches.push('colors must be array');
    if (!Array.isArray(product.images)) mismatches.push('images must be array');
    
    // UUID mismatch check
    // In our import script, we intentionally omit 'id' so Supabase auto-generates a UUID.
    // We will flag 'id' if it's passed as a non-UUID, but note that our script handles it.
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (product.id && !uuidRegex.test(product.id)) {
      mismatches.push('id is not a UUID (Note: Import script will drop this field and auto-generate)');
    }

    if (missing.length > 0 || mismatches.length > 0) {
      invalidCount++;
      // console.log(`Product [${product.name || index}]:`);
      if (missing.length > 0) console.log(`  Missing: ${missing.join(', ')}`);
      if (mismatches.length > 0) {
        mismatches.forEach(m => schemaMismatchesTotal.add(m));
      }
    }
  });

  console.log("--- VALIDATION REPORT ---");
  console.log(`Total Products: ${seedProducts.length}`);
  console.log(`Missing Fields: ${missingFieldsTotal.size > 0 ? Array.from(missingFieldsTotal).join(', ') : 'None'}`);
  console.log(`Invalid Fields / Schema Mismatches:`);
  if (schemaMismatchesTotal.size > 0) {
    Array.from(schemaMismatchesTotal).forEach(m => console.log(` - ${m}`));
  } else {
    console.log(" - None");
  }

  if (invalidCount === 0 || (invalidCount > 0 && Array.from(schemaMismatchesTotal).every(m => m.includes('id is not a UUID')))) {
    console.log("\n✅ VALIDATION PASSED. (UUID mismatch is handled by import script auto-generation).");
  } else {
    console.log("\n❌ VALIDATION FAILED. Fix errors before importing.");
  }
}

runValidation();
