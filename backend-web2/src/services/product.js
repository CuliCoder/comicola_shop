import connection from "../database/database.js";

export const getProduct = () =>
  new Promise(async (resolve, reject) => {
    try {
      const [rows, fields] = await connection.query(`SELECT 
		p.*,
        GROUP_CONCAT(DISTINCT JSON_OBJECT('id', c.id, 'label', c.name)) AS category,
        GROUP_CONCAT(DISTINCT g.thumbnail) AS gallery
      FROM 
        product p
      LEFT JOIN 
        product_category pc ON p.id = pc.id_Product
      LEFT JOIN 
        category c ON pc.id_Category = c.id
      LEFT JOIN 
        gallery g ON p.id = g.product_id
      WHERE 
        p.status = 1 and c.status = 1 and g.status = 1 and p.quantity > 0
      GROUP BY 
        p.id
      ORDER BY 
        p.update_at DESC`);
      const products = rows.map((product) => {
        return {
          ...product,
          category: JSON.parse(`[${product.category}]`),
          gallery: product.gallery ? product.gallery.split(",") : [],
        };
      });
      resolve(products);
    } catch (error) {
      console.log(error);
      reject(null);
    }
  });
export const getProductForAdmin = () =>
  new Promise(async (resolve, reject) => {
    try {
      const [rows, fields] = await connection.query(`SELECT 
      p.*,
          GROUP_CONCAT(DISTINCT JSON_OBJECT('id', c.id, 'label', c.name)) AS category,
          GROUP_CONCAT(DISTINCT g.thumbnail) AS gallery
        FROM 
          product p
        LEFT JOIN 
          product_category pc ON p.id = pc.id_Product
        LEFT JOIN 
          category c ON pc.id_Category = c.id
        LEFT JOIN 
          gallery g ON p.id = g.product_id
        WHERE 
        c.status = 1 and g.status = 1 and p.status = 1
        GROUP BY 
          p.id
        ORDER BY 
          p.update_at DESC`);
      const products = rows.map((product) => {
        return {
          ...product,
          category: JSON.parse(`[${product.category}]`),
          gallery: product.gallery ? product.gallery.split(",") : [],
        };
      });
      resolve(products);
    } catch (error) {
      console.log(error);
      reject(null);
    }
  });
export const getProductlimit = (limit) =>
  new Promise(async (resolve, reject) => {
    try {
      const products = await connection.execute(
        "SELECT id,title,price,thumbnail from product where status = 1 order by update_at DESC limit ?",
        [limit]
      );
      resolve({
        error: products[0].length === 0 ? 1 : 0,
        products: products[0],
      });
    } catch (error) {
      console.log(error);
      reject({
        error: 1,
        message: error,
      });
    }
  });
export const addProduct = (
  categories,
  author_id,
  title,
  url_img,
  description,
  introduce
) =>
  new Promise(async (resolve, reject) => {
    let client;
    try {
      client = await connection.getConnection();
      const [result, fields] = await client.execute(
        "INSERT INTO product(author_id, title, thumbnail, description,introduce,created_at,update_at, status) VALUES (?, ?, ?, ?,?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1)",
        [author_id, title, url_img, description, introduce]
      );
      if (result.affectedRows === 0) {
        await client.rollback();
        resolve({
          error: 1,
          message: "error",
        });
        return;
      }
      const placeholders = categories.map(() => "(?, ?)").join(", ");
      const sql = `INSERT INTO product_category (id_Product, id_Category) VALUES ${placeholders}`;
      const values = [];
      categories.forEach((id_Category) => {
        values.push(result.insertId, id_Category);
      });
      const cate = await client.execute(sql, values);
      if (cate[0].affectedRows === 0) {
        await client.rollback();
        resolve({
          error: 1,
          message: "error",
        });
        return;
      }
      await client.commit();
      resolve({
        error: 0,
        message: "success",
        id: result.insertId,
      });
    } catch (error) {
      console.log(error);
      await client.rollback();
      reject({
        error: 1,
        message: error,
      });
    } finally {
      if (client) client.release();
    }
  });

export const searchProductByName = async (value_search) => {
  try {
    const [result, fields] = await connection.execute(
      `SELECT p.*, a.name AS author_name,
                  GROUP_CONCAT(g.thumbnail SEPARATOR ',') AS gallery_images
                  FROM product p
                  LEFT JOIN gallery g ON p.id = g.product_id
                  LEFT JOIN author a ON p.author_id = a.id
                  WHERE p.title LIKE CONCAT('%', ?, '%')
                  GROUP BY p.id
                  ORDER BY p.id`,
      [value_search]
    );
    return result;
  } catch (error) {
    return null;
  }
};

export const sortDateHightoLow = async () => {
  try {
    const [result, fields] = await connection.execute(
      `SELECT p.*, a.name AS author_name, c.name AS category_name,
                    GROUP_CONCAT(g.thumbnail SEPARATOR ',') AS gallery_images
                    FROM product p
                    LEFT JOIN gallery g ON p.id = g.product_id
                    LEFT JOIN author a ON p.author_id = a.id
                    LEFT JOIN category c ON p.category_id = c.id
                    GROUP BY p.id
                    ORDER BY p.price DESC`
    );
    return result;
  } catch (error) {
    return null;
  }
};

export const sortDateLowToHigh = async () => {
  try {
    const [result, fields] = await connection.execute(
      `SELECT p.*, a.name AS author_name, c.name AS category_name,
                    GROUP_CONCAT(g.thumbnail SEPARATOR ',') AS gallery_images
                    FROM product p
                    LEFT JOIN gallery g ON p.id = g.product_id
                    LEFT JOIN author a ON p.author_id = a.id
                    LEFT JOIN category c ON p.category_id = c.id
                    GROUP BY p.id
                    ORDER BY p.price ASC`
    );
    return result;
  } catch (error) {
    return null;
  }
};

export const deleteProduct = async (idProduct) => {
  try {
    let [result, fields] = await connection.execute(
      `Update product set status = 0 where id = ?`,
      [idProduct]
    );

    if (result) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getProductWithCategory = async (id) => {
  try {
    const [result, fields] = await connection.execute(
      `SELECT p.*, a.name AS author_name, c.name AS category_name,
                        GROUP_CONCAT(g.thumbnail SEPARATOR ',') AS gallery_images
                  FROM product p
                  LEFT JOIN gallery g ON p.id = g.product_id
                  LEFT JOIN author a ON p.author_id = a.id
                  LEFT JOIN category c ON p.category_id = c.id
                  WHERE p.category_id = ? 
                  GROUP BY p.id
                  ORDER BY p.id`,
      [id]
    );
    if (!result) {
      return null;
    }

    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const get_products_at_home = (category_id1, category_id2) =>
  new Promise(async (resolve, reject) => {
    try {
      const new_products = await connection.query(
        "SELECT id,title,price,thumbnail FROM product where status = 1 order by update_at DESC limit 8"
      );
      const by_category1 = await connection.query(
        "SELECT p.id,p.title,p.price,p.thumbnail FROM product p left join product_category pc on p.id = id_Product join category c on id_Category = c.id where p.status = 1 and c.id=? and c.status =1 order by update_at DESC limit 8",
        [category_id1]
      );
      const by_category2 = await connection.query(
        "SELECT p.id,p.title,p.price,p.thumbnail FROM product p left join product_category pc on p.id = id_Product join category c on id_Category = c.id where p.status = 1 and c.id=? and c.status =1 order by update_at DESC limit 8",
        [category_id2]
      );
      resolve({
        new_products: new_products[0],
        by_category1: by_category1[0],
        by_category2: by_category2[0],
      });
    } catch (error) {
      console.log(error);
      reject(null);
    }
  });
export const getProductById = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const product = await connection.query(
        "select * from product where id = ? and status = 1",
        [id]
      );
      resolve({
        error: product[0].length === 0 ? 1 : 0,
        product: product[0][0] || null,
      });
    } catch (error) {
      console.error(error);
      reject({
        error: 1,
        message: error,
      });
    }
  });
export const getProductByCategory = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const new_products = await connection.query(
        "select c.name,p.id,title,price,thumbnail from product p left join product_category pc on p.id = pc.id_Product left join category c on c.id = pc.id_Category where c.id = ? and c.status = 1 and p.status = 1 order by p.update_at DESC",
        [id]
      );
      const price = await connection.query(
        "select p.id,title,price,thumbnail from product p left join product_category pc on p.id = pc.id_Product left join category c on c.id = pc.id_Category where c.id = ? and c.status = 1 and p.status = 1 order by price",
        [id]
      );
      const price_desc = await connection.query(
        "select p.id,title,price,thumbnail from product p left join product_category pc on p.id = pc.id_Product left join category c on c.id = pc.id_Category where c.id = ? and c.status = 1 and p.status = 1 order by price DESC",
        [id]
      );
      resolve({
        name: new_products[0][0].name,
        new_products: new_products[0],
        price: price[0],
        price_desc: price_desc[0],
      });
    } catch (error) {
      console.error(error);
      reject({
        error: 1,
        message: error,
      });
    }
  });

export const updateProduct = async (product) => {
  let done = false;
  try {
    await connection.execute(
      `UPDATE product SET title = ?, description = ?, introduce = ? WHERE id = ?`,
      [product.title, product.description, product.introduce, product.productId]
    );

    if (product.categoryAdd.length > 0) {
      product.categoryAdd.forEach(async (id_Category) => {
        await connection.execute(
          `INSERT INTO product_category (id_Product, id_Category) VALUES (?, ?)`,
          [product.productId, id_Category]
        );
      });
    }

    if (product.categoryRemove.length > 0) {
      product.categoryRemove.forEach(async (id_Category) => {
        await connection.execute(
          `DELETE FROM product_category WHERE id_Product = ? AND id_Category = ?`,
          [product.productId, id_Category]
        );
      });
    }

    if (product.imagesDelete.length > 0) {
      product.imagesDelete.forEach(async (imageURL) => {
        await connection.execute(
          `delete from gallery where product_id = ? and thumbnail = ?`,
          [product.productId, imageURL]
        );
      });
    }
    done = true;

    if (done) {
      return {
        error: 0,
        message: "success",
      };
    } else {
      return {
        error: 1,
        message: "error",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      error: 1,
      message: error,
    };
  }
};
