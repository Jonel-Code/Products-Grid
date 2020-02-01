export default class ProductService {
    constructor() {
        this.url = '/api/products';
    }

    fetchProductList(page = { index: 1, limit: 10 }, sortBy = ['id']) {
        const query = {
            '_page': page.index,
            '_limit': page.limit
        };

        if (Array.isArray(sortBy) && sortBy.length > 0) {
            query['_order'] = 'asc';
            query['_sort'] = sort.by.join(',');
        }

        const queryParam = new URLSearchParams(query);

        return fetch(`${this.url}?${queryParam.toString()}`, {
            method: 'GET'
        }).then(response => {
            if (response.ok) {
                return response.json();
            }

            return response.json().then(err => {
                return Promise.reject(err);
            });
        });
    }
}

