import { Helmet } from 'react-helmet-async';
import { Products } from "@types-my/query.type"
import { FC } from 'react';

interface Props {
    product: Products
}

const OpenGraph:FC<Props> = ({ product }) => {
  const title = product?.title || 'Название по умолчанию';
  const description = product?.description || 'Описание по умолчанию';
  const imageUrl = `${import.meta.env.VITE_URL}/${product.favicon}` || '/img/default.png';  // Укажите путь к изображению по умолчанию
  const productUrl = `${window.location.origin}/product/${product?._id}`; // Полный URL страницы

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={productUrl} />
      <meta property="og:type" content="product" /> {/* Укажите тип контента (product, article, website и т.д.) */}
    </Helmet>
  );
};

export default OpenGraph;