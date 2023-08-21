async getProducts(limit = 10, page = 1, sort = 0, filter = null, valueFilter = null) {
    try {
        let whereOptions = {}
        if (filter != '' && valueFilter != '') {
            whereOptions = { [filter]: valueFilter }//De esta forma podemos colocar una key dinamica. []
        };
        let result = await productsModel.paginate(
            whereOptions,
            {
                limit: limit,
                page: page,
                sort: { price: sort },
                lean: true
            }
        );
        result.prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}` : '';
        result.nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}` : '';
        return result
    } catch (error) {
        console.log('Error al obtener los productos con paginacion y filtros', error)
    }
};
/////////////////////////////
router.get('/allProducts', async (req, res) => {
    try {
        let products = await productManager.products();

        let profileRoleTemplate;
        if (req.session.role === 'Admin') {
            profileRoleTemplate = 'profileRole';
        } else {
            profileRoleTemplate = 'profile';
        }

        const context = {
            title: 'Inicio',
            user: req.session.user,
            products: products
        };

        res.render('products', context);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Ocurrió un error al obtener los productos.');
    }
});
