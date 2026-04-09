import Product from "../models/Product.js";

const demoProducts = [];

const normalizeProductInput = (body = {}) => {
  const name = String(body.name ?? "").trim();
  const price = Number(body.price);
  const stock = Number(body.stock);

  if (!name) return { error: "Name is required" };
  if (!Number.isFinite(price)) return { error: "Price must be a valid number" };
  if (!Number.isFinite(stock)) return { error: "Stock must be a valid number" };

  return {
    data: {
      name,
      price,
      stock,
    },
  };
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.json(products);
  } catch {
    // Fallback for demo mode when MongoDB is not connected
    return res.json(demoProducts);
  }
};

export const addProduct = async (req, res) => {
  const normalized = normalizeProductInput(req.body);
  if (normalized.error) {
    return res.status(400).json({ message: normalized.error });
  }

  try {
    const newProduct = new Product(normalized.data);
    const saved = await newProduct.save();

    if (saved.stock < 5) {
      console.log(
        `⚠️ Low stock alert: ${saved.name} has only ${saved.stock} items`,
      );
    }

    return res.json(saved);
  } catch {
    const saved = {
      _id: crypto.randomUUID(),
      ...normalized.data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    demoProducts.push(saved);

    if (saved.stock < 5) {
      console.log(
        `⚠️ Low stock alert: ${saved.name} has only ${saved.stock} items`,
      );
    }

    return res.json(saved);
  }
};

export const updateProduct = async (req, res) => {
  const normalized = normalizeProductInput(req.body);
  if (normalized.error) {
    return res.status(400).json({ message: normalized.error });
  }

  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      normalized.data,
      {
        new: true,
      },
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (updated.stock < 5) {
      console.log(
        `⚠️ Low stock alert: ${updated.name} has only ${updated.stock} items`,
      );
    }

    return res.json(updated);
  } catch {
    const index = demoProducts.findIndex((p) => p._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: "Product not found" });
    }

    demoProducts[index] = {
      ...demoProducts[index],
      ...normalized.data,
      updatedAt: new Date().toISOString(),
    };

    if (demoProducts[index].stock < 5) {
      console.log(
        `⚠️ Low stock alert: ${demoProducts[index].name} has only ${demoProducts[index].stock} items`,
      );
    }

    return res.json(demoProducts[index]);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    return res.json({ message: "Deleted successfully" });
  } catch {
    const index = demoProducts.findIndex((p) => p._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: "Product not found" });
    }

    demoProducts.splice(index, 1);
    return res.json({ message: "Deleted successfully" });
  }
};
