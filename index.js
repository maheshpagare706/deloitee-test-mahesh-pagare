document.addEventListener('DOMContentLoaded', () => {
  const productList = document.getElementById('product-list');
  const filterInput = document.getElementById('filter');
  const sortSelect = document.getElementById('sort');
  const count = document.getElementById('count');
  const loader = document.getElementById('loader');
  const loadMoreButton = document.getElementById('load-more');
  let products = [];
  let filteredProducts = [];
  let currentIndex = 0;
  const itemsPerPage = 10;
  const product_API = 'https://fakestoreapi.com/products';
 
  const fetchProducts = async()=> {
    const loader = document.getElementById('loader');
     try {
        loader.style.display = 'block'; 
       let response = await fetch(product_API);

       if (!response.ok) {
        handleErrors(response.status);
        return;
       }
        products = await response.json();
        filteredProducts = products;
        loadProductList();
  
    } catch (error) {
        console.error('Error fetching products:', error);
  
    } finally {
        loader.style.display = 'none'; // Hide loader
    }
  }   
  fetchProducts(); 

  function handleErrors(status) {
    switch (status) {
        case 404:
            alert('Error 404: Not Found')
            break;
        case 500:
            alert('Error 500: Internal Server Error');
            break;
        default:
           alert('An unexpected error occurred');
            break;
    }
}
  const loadProductList = () => {
      const endIndex = currentIndex + itemsPerPage;
      const productsToRender = filteredProducts.slice(currentIndex, endIndex);
      productsToRender.forEach(product => {
          const productElement = document.createElement('div');
          productElement.className = 'product';
          productElement.innerHTML = `
              <img src="${product.image}" alt="${product.title}">
              <p class='title'>${product.title}</p>
              <p>Price: $${product.price}</p>
          `;
          productList.appendChild(productElement);
      });
      currentIndex += itemsPerPage;
      if (currentIndex >= filteredProducts.length) {
          loadMoreButton.style.display = 'none';
      }
      count.innerHTML = `${filteredProducts.length} Results`
  };

 
    const checkboxes = document.querySelectorAll('input[name="category"]');
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('click', getCheckedValues);
    });

    function getCheckedValues() {
      const checkboxes = document.querySelectorAll('input[name="category"]:checked');
      let values = [];
      checkboxes.forEach((checkbox) => {
          values.push(checkbox.value);
      });
       console.log("selected checkbox val = ",values); 
      for (let product of products) {
        filteredProducts = products.filter(product => values.includes(product.category)) 
       }
      console.log("filteredProducts = ",filteredProducts);

      if(filteredProducts.length <= 0){
        filteredProducts = products;
      }
      currentIndex = 0;
      productList.innerHTML = '';
      loadProductList();
      loadMoreButton.style.display = filteredProducts.length > itemsPerPage ? 'block' : 'none';
  }

  // Search products
   filterInput.addEventListener('input', () => {
      const filterText = filterInput.value.toLowerCase();
      filteredProducts = products.filter(product => product.title.toLowerCase().includes(filterText));
      currentIndex = 0;
      productList.innerHTML = '';
      loadProductList();
      loadMoreButton.style.display = filteredProducts.length > itemsPerPage ? 'block' : 'none';
      if(filteredProducts.length <= 0){
        productList.innerHTML = '<p style="text-align:center;width: 100%;">No Data Found</p>'
      }
  }); 

  // Sort products
  sortSelect.addEventListener('change', () => {
      const sortValue = sortSelect.value;
      filteredProducts.sort((a, b) => {
          if (sortValue === 'title') {
              return a.title.localeCompare(b.title);
          } else if (sortValue === 'price') {
              return a.price - b.price;
          }
      });
      currentIndex = 0;
      productList.innerHTML = '';
      loadProductList();
      loadMoreButton.style.display = filteredProducts.length > itemsPerPage ? 'block' : 'none';
  });

  // Load more products
  loadMoreButton.addEventListener('click', () => {
      loadProductList();
  });
});

