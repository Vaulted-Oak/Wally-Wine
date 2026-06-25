import { useProduct } from '@shopify/hydrogen-react';
import React from 'react';
import beef from 'static/media/paringImage/beef.svg';
import asianCuisine from 'static/media/paringImage/asian-cuisine.svg';
import chicken from 'static/media/paringImage/chicken.svg';
import chocolate from 'static/media/paringImage/chocolate.svg';
import duck from 'static/media/paringImage/duck.svg';
import greenVegetables from 'static/media/paringImage/green-vegetables.svg';
import lamb from 'static/media/paringImage/lamb.svg';
import mildCheese from 'static/media/paringImage/mild-cheese.svg';
import pasta from 'static/media/paringImage/pasta.svg';
import pork from 'static/media/paringImage/pork.svg';
import rootVegetables from 'static/media/paringImage/root-vegetables.svg';
import strongCheese from 'static/media/paringImage/strong-cheese.svg';
import { Product } from '@shopify/hydrogen/storefront-api-types';

const images: { [key: string]: string } = {
    Beef: beef,
    Chocolate: chocolate,
    Duck: duck,
    "Green Vegetables": greenVegetables,
    Lamb: lamb,
    "Mild Cheese": mildCheese,
    Pasta: pasta,
    Pork: pork,
    "Root Vegetables": rootVegetables,
    "Asian Cuisine": asianCuisine,
    Chicken: chicken,
    "Strong Cheese": strongCheese,
};

interface Metafield {
    key: string;
    id: string;
    value: string;
}
interface ProductWithPairings extends Product {
    pairings?: Metafield;
    foodParings?:Metafield;
}
export function ParingBlock() {
    const { product } = useProduct();
    if (!product) return null;
    const productWithPairings = product as ProductWithPairings;

    if (productWithPairings?.foodParings?.key === "food_pairings") {
        return (
            <Layout>
                <Paring data={productWithPairings.foodParings as Metafield} />
            </Layout>)
    }
    return null;
}

function Layout({ children }: { children: React.ReactNode }) {
    return <div className="mb-8">{children}</div>;
}

function Paring({ data }: { data: Metafield }) {
    let pairings: string[] = [];

    try {
        // Check if data.value is a valid JSON array, and assert its type as string[]
        pairings = Array.isArray(JSON.parse(data.value))
            ? JSON.parse(data.value) as string[]  // Type assertion to string[]
            : data.value.split(',').map(item => item.trim()); // Split by comma and trim each item
    } catch (e) {
        // If JSON parsing fails, assume it's a plain string and put it in an array
        pairings = data.value.split(',').map(item => item.trim());
    }

    return (
        <div>
            <strong className='text-[16px] text-primaryGreen block mb-6 tracking-[1px]'>Pairings</strong>
            <div className="flex flex-wrap gap-5">
                {pairings?.map((item: string) => {
                    const imageSrc = images[item];
                    return imageSrc ? (
                        <div key={item} className="flex flex-col items-center text text-center gap-2">
                            <img className="min-h-[40px]" src={imageSrc} alt={item} width={40} height={30} />
                            <span>{item}</span>
                        </div>
                    ) : null;
                })}
            </div>
        </div>
    );
}