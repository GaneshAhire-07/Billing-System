export const isProductIdExists = (productId) => {
  try {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    return products.some((product) => product.productId === productId);
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return false;
  }
};

export const saveProduct = (product) => {
  try {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    throw new Error('Failed to save product.');
  }
};