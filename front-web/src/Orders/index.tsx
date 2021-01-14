import { useEffect, useState } from 'react';
import StepsHeader from './StepsHeader';
import ProductsList from './ProductsList';
import { fetchProducts, saveOrders } from '../api';
import { toast } from 'react-toastify';
import { OrderLocationData, Product } from './types';
import OrderLocation from './OrderLocation';
import OrderSummary from './OrderSummary';
import Footer from '../Footer';
import { checkSelected } from './helpers';
import './styles.css';

function Orders() {
    const [products, setProducts] = useState <Product[]>([]);
    const [selectedProducts, setSelectedProducts] = useState <Product[]>([]);
    const [orderLocation, setOrderLocation] = useState<OrderLocationData>();
    const totalPrice = selectedProducts.reduce((sum, item) => {
        return sum + item.price
    }, 0);

    useEffect(() => {
        fetchProducts()
        .then(response => setProducts(response.data))
        .catch(error => console.log(error))
    }, []);

    const handleSelectProduct = (product: Product) => {
        const isAlreadySelected = checkSelected(selectedProducts, product);
      
        if (isAlreadySelected) {
          const selected = selectedProducts.filter(item => item.id !== product.id);
          setSelectedProducts(selected);
        } else {
          setSelectedProducts(previous => [...previous, product]);
        }
      }

      const handleSubmit = () => {
        const productsIds = selectedProducts.map(({ id }) => ({ id }));

        const payload = {
          ...orderLocation!,
          products: productsIds
        }

        console.log(`Address: ${orderLocation?.address}`);
        console.log(productsIds.length);

        orderLocation?.address !== undefined ? (
                                                productsIds.length > 0 ? (
                                                  saveOrders(payload).then((response) => {
                                                    toast.error(`Pedido enviado com sucesso! Nº ${response.data.id}`);
                                                    setSelectedProducts([]);
                                                  })
                                                  .catch(() => {
                                                    toast.warning('Erro ao enviar pedido!');
                                                  })
                                                ) 
                                                : 
                                                toast.warning('Você precisa escolher pelo menos um produto!') 
                                              ) 
                                              : 
                                              toast.warning('Você precisa informar o endereço para prosseguir!')

      }

    return(
        <>
            <div className="orders-container">
                <StepsHeader />
                <ProductsList 
                    products={products} 
                    onSelectProduct={handleSelectProduct}
                    selectedProducts={selectedProducts}
                />
                <OrderLocation 
                    onChangeLocation={location => setOrderLocation(location)} 
                />
                <OrderSummary 
                    amount={selectedProducts.length} 
                    totalPrice={totalPrice} 
                    onSubmit={handleSubmit}
                />
                <Footer />
            </div>
        </>
    )
}

export default Orders;
