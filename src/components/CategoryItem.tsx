import React, { FC, useState } from 'react'
import { Category } from 'src/types/types'

interface ICategoryItem {
  node: Category,
  order: number,
  handleAddCategory: (tree: Category, parentId: number, categoryText: string) => void,
  scale: number,
  handleDeleteCategory: (id: number) => void
  handleChangeCategory: (node: Category, id: number, categoryText: string) => void
}

const CategoryItem: FC<ICategoryItem> = ({ node, handleAddCategory, scale, handleChangeCategory, handleDeleteCategory }) => {
  const [isInputVisible, setInputVisible] = useState(false);
  const [inputText, setInputText] = useState('');

  const handleShowInput = () => {
    setInputVisible(true);
    setInputText(node.text)
  };

  const handleInputChange = (e) => {
    e.preventDefault()
    setInputText(e.target.value);
  };

  const handleInputBlur = () => {
    setInputVisible(false);
    handleChangeCategory(node, node.id, inputText)  
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      setInputVisible(false);
      handleChangeCategory(node, node.id, inputText)
    }
  };
  return (
    <div
      style={{
        position: 'relative',
        width: `${scale * 140}px`,
        margin: '0 auto',
        height: `auto`,
        border: '1px solid grey',
        borderRadius: '5px',
        padding: '0.5rem',
        boxSizing: 'content-box',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {isInputVisible ? (
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          style={{ width: `${scale * 120}px`}}
        />) : <div className='container-category-item-btn' >
        <div style={{width: `${scale * 140}px`}}>{node.text}</div>
        <button style={{ width: `${scale * 40}px`, fontSize: `${scale * 16}px`}} className='btn-change-category' onClick={handleShowInput}><i className="fa-solid fa-pen"></i></button>
        <button style={{ width: `${scale * 40}px`, fontSize: `${scale * 16}px`}} className='btn-add-category' onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        handleAddCategory(node ,node.id, '')
      }}>+</button>
      {node.id !== 1 && <button style={{ width: `${scale * 40}px`, fontSize: `${scale * 16}px`}} className='btn-delete-category' onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        handleDeleteCategory(node.id)
      }}><i className="fa-solid fa-trash"></i></button>}
      </div>}
    </div>)
}

export default CategoryItem