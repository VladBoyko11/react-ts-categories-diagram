import React, { FC, useEffect, useState } from "react"
import { Category } from "src/types/types"
import CategoryItem from "./CategoryItem"

interface ICategoryList {
    topLevelNode: Category,
    handleAddCategory: (tree: Category, parentId: number, categoryText: string) => void,
    scale: number,
    handleChangeCategory: (node: Category, id: number, categoryText: string) => void,
    handleDeleteCategory: (id: number) => void
}

const CategoryList: FC<ICategoryList> = ({ topLevelNode, handleAddCategory, scale, handleChangeCategory, handleDeleteCategory }) => {
    return <div
    >
        <div style={{width: '100%', fontSize: `${scale * 16}px`}}><CategoryItem handleDeleteCategory={handleDeleteCategory} handleChangeCategory={handleChangeCategory} scale={scale} node={topLevelNode} order={0} key={JSON.stringify(topLevelNode)} handleAddCategory={handleAddCategory} /></div>
            {topLevelNode.children.length > 0 ? <div className="category-list">
                {topLevelNode.children.map(node => {
                    return <CategoryList handleDeleteCategory={handleDeleteCategory} handleChangeCategory={handleChangeCategory} scale={scale} topLevelNode={node as Category} handleAddCategory={handleAddCategory} />
                })}
            </div> : null}
    </div>
}

export default CategoryList