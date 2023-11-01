import React, { useEffect, useState } from 'react';
import { Category } from './types/types';
import CategoryList from './components/CategoryList';

const App: React.FC = () => {

  const [isDragging, setIsDragging] = useState(false);
  let drag = false
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isCentered, setIsCentered] = useState(false)
  const ref = React.createRef<HTMLDivElement>()

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    drag = true
    setIsCentered(false)
    setOffset({
      x: ref.current!.offsetLeft - e.clientX,
      y: ref.current!.offsetTop - e.clientY,
    });
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    e.preventDefault()
    if (drag) {
      setPosition({
        x: e.clientX + offset.x,
        y: e.clientY + offset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
  };

  const [topLevelNode, setTopLevelNode] = useState<Category>({
    id: 1,
    text: 'Parent',
    children: []
  })

  const handleAddCategory = (tree: Category = topLevelNode, parentId: number, categoryText: string) => {
    const newCategory: Category = {
      id: Date.now(),
      text: categoryText,
      children: [],
    };
    tree.children.push(newCategory);
    setTopLevelNode({...topLevelNode})
  }

  const handleDeleteCategory = (id: number) => {
    const categories = topLevelNode.children.filter((category) => {
      if (category.id === id) {
        return category.id !== id
      } else {
        if (category.children.length > 0) {
          const children = deleteCategoryChildren(category.children, id)
          category.children = [...children]
          return category
        }
      }
      return category;
    });
    setTopLevelNode({
      id: topLevelNode.id,
      text: topLevelNode.text,
      children: [...categories]
    })
  }

  const deleteCategoryChildren = (categoryList: Category[], id: number) => {
    return categoryList.filter((category) => {
      if (category.id === id) {
        return category.id !== id
      } else {
        if (category.children.length > 0) {
          category.children = deleteCategoryChildren(category.children, id)
          return category;
        }
      }
      return category;
    })
  }

  const handleChangeCategory = (node: Category, id: number, categoryText: string) => {
    node.text = categoryText
    setTopLevelNode({...topLevelNode})
  }

  const options = [0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.25, 1.5];
  const [scale, setScale] = useState(options[5]);
  const handleNext = () => {
    const currentIndex = options.indexOf(scale);
    if (currentIndex < options.length - 1) {
      setScale(options[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const currentIndex = options.indexOf(scale);
    if (currentIndex > 0) {
      setScale(options[currentIndex - 1]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setScale(Number(e.target.value));
  };

  const handleBtnMoveTop = (e: any) => {
    setPosition({ x: position.x, y: position.y - 25 })
  }
  const handleBtnMoveBottom = (e: any) => {
    setPosition({ x: position.x, y: position.y + 25 })
  }
  const handleBtnMoveLeft = (e: any) => {
    setPosition({ x: position.x - 25, y: position.y })
  }
  const handleBtnMoveRight = (e: any) => {
    setPosition({ x: position.x + 25, y: position.y })
  }

  return <>
    <header>
      <div className='header-name'>Services</div>
      <button className='btn-center' onClick={() => {
        setIsCentered(true)
        setPosition({ x: 0, y: 0 })
      }}><i className="fa-solid fa-align-center"></i></button>
      <div className='scale'>
        <form name='scale-form' onSubmit={(e) => {
          e.preventDefault()
        }}>
          <button className='btn-scale' onClick={handlePrevious} disabled={options.indexOf(scale) === 0}>
            {'-'}
          </button>
          <select className='select-scale' value={scale} onChange={handleChange}>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button className='btn-scale' onClick={handleNext} disabled={options.indexOf(scale) === options.length - 1}>
            {'+'}
          </button>
        </form>
      </div>
    </header>
    <div style={{
      position: "relative",
      width: "100%",
      height: "85vh",
      fontSize: `${scale * 16}px`
    }}
      className={isCentered ? 'centerDiv' : ''}
    >
      <div onClick={handleBtnMoveTop} className='btn-move btn-move-x' style={{ top: 0 }}><i className="fa-solid fa-arrow-up"></i></div>
      <div onClick={handleBtnMoveLeft} className='btn-move btn-move-y' style={{ left: 0 }}><i className="fa-solid fa-arrow-left"></i></div>
      <div onClick={handleBtnMoveRight} className='btn-move btn-move-y' style={{ right: 0 }}><i className="fa-solid fa-arrow-right"></i></div>
      <div onClick={handleBtnMoveBottom} className='btn-move btn-move-x' style={{ bottom: 0 }}><i className="fa-solid fa-arrow-down"></i></div>
      <div style={{
        position: isCentered ? 'relative' : 'absolute',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
        ref={ref}
        onMouseDown={handleMouseDown}
      >
        <CategoryList
          handleDeleteCategory={handleDeleteCategory}
          handleChangeCategory={handleChangeCategory}
          topLevelNode={topLevelNode}
          handleAddCategory={handleAddCategory}
          scale={scale}
        />
      </div>
    </div>
  </>
};

export default App;