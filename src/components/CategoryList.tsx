import React, { FC, useEffect, useState } from "react"
import { Category, EnrichedCategory } from "src/types/types"
import CategoryItem from "./CategoryItem"

interface ICategoryList {
    topLevelNode: EnrichedCategory,
    handleAddCategory: (parentId: number, categoryName: string) => void,
    flatten: (node: Category | EnrichedCategory) => Array<EnrichedCategory>,
    scale: number,
    handleChangeCategory: (id: number, categoryText: string) => void,
    handleDeleteCategory: (id: number) => void
}

const CategoryList: FC<ICategoryList> = ({ topLevelNode, handleAddCategory, flatten, scale, handleChangeCategory, handleDeleteCategory }) => {
    return <div
    >
        <div style={{width: '100%', fontSize: `${scale * 16}px`}}><CategoryItem handleDeleteCategory={handleDeleteCategory} handleChangeCategory={handleChangeCategory} scale={scale} node={topLevelNode} order={0} key={JSON.stringify(topLevelNode)} handleAddCategory={handleAddCategory} /></div>
            {topLevelNode.children.length > 0 ? <div className="category-list">
                {topLevelNode.children.map(node => {
                    return <CategoryList handleDeleteCategory={handleDeleteCategory} handleChangeCategory={handleChangeCategory} scale={scale} topLevelNode={node as EnrichedCategory} flatten={flatten} handleAddCategory={handleAddCategory} />
                })}
            </div> : null}
    </div>
}

export default CategoryList