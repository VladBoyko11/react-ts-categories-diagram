import React, { useEffect, useState } from 'react';
import { Category, EnrichedCategory } from './types/types';
import CategoryList from './components/CategoryList';

const App: React.FC = () => {

  const [isDragging, setIsDragging] = useState(false);
  let drag = false
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isCentered, setIsCentered] = useState(false)
  const [isAddCategory, setIsAddCategory] = useState<boolean>(false)
  const ref = React.createRef<HTMLDivElement>()

  const handleMouseDown = (e: any) => {
    setIsDragging(true);
    drag = true
    setIsCentered(false)
    setOffset({
      x: ref.current!.offsetLeft - e.clientX,
      y: ref.current!.offsetTop - e.clientY,
      // x: e.clientX,
      // y: e.clientY,
    });
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: any) => {
    e.preventDefault()
    if (drag) {
      setPosition({
        x: e.clientX + offset.x,
        y: e.clientY + offset.y,
        // x: e.clientX,
        // y: e.clientY - 150
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    // document.removeEventListener('mouseup', handleMouseUp);
  };

  const [categories, setCategories] = useState<Category[]>([])
  const [enrichedTopLevelNode, setEnrichedTopLevelNode] = useState<EnrichedCategory>({
    id: 1,
    text: 'Parent',
    children: categories,
    depth: 0,
    descendentsCount: 0,
    heightDiffWithLastDirectChild: 0
  })
  console.log(enrichedTopLevelNode)
  useEffect(() => {
    setEnrichedTopLevelNode(enrich({
      id: 1,
      text: enrichedTopLevelNode.text,
      children: categories
    }))
  }, [categories])

  const enrich = (node: Category, depthOffset = 0): EnrichedCategory => {
    if (node.children.length === 0) {
      return {
        ...node,
        depth: depthOffset,
        descendentsCount: 0,
        heightDiffWithLastDirectChild: 0,
      }
    }

    const enrichedChildren = node.children.map((child) => enrich(child, depthOffset + 1))
    const descendentsCount = node.children.length + enrichedChildren.reduce(
      (acc, enrichedChild) => acc + enrichedChild.descendentsCount,
      0,
    )
    const heightDiffWithLastDirectChild = descendentsCount - enrichedChildren[node.children.length - 1].descendentsCount
    return {
      ...node,
      children: enrichedChildren,
      depth: depthOffset,
      descendentsCount,
      heightDiffWithLastDirectChild,
    }
  }

  // console.log(categories)
  const handleAddCategory = (parentId: number, categoryText: string) => {
    // setIsAddCategory(true)
    const newCategory: Category = {
      id: Date.now(), // Генерируем уникальный ID (обычно он должен быть уникальным)
      text: categoryText,
      children: [],
      // level: 0
    };

    if (parentId === 1) {
      setCategories((prevCategories) => {
        return [...prevCategories, newCategory]
      })
    }

    setCategories((prevCategories) => {
      if (flatten({
        id: 1,
        text: enrichedTopLevelNode.text,
        children: prevCategories,
        // level: 0
      }).find((category) => {
        if (category.id === newCategory.id) return true
        else return false
      })) {
        return prevCategories
      }
      return prevCategories.map((category) => {
        if (category.id === parentId) {
          category.children.push(newCategory)
          return category
        } else {
          if (category.children.length > 0) {
            updateCategory(category.children, parentId, newCategory);
          }
        }
        return category;
      });
    });
  };
  
  const handleDeleteCategory = (id: number) => {
    setCategories((prevCategories) => {
      return prevCategories.filter((category) => {
        if (category.id === id) {
          return category.id !== id
        } else {
          if (category.children.length > 0) {
            category.children = deleteCategoryChildren(category.children, id)
            return category;
          }
        }
        return category;
        // return category.id !== id
      });
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

    // for (let category of categoryList) {
    //   if (category.id === id) {
    //     return category.id !== id
    //   } else if (category.children && category.children.length > 0) {
    //     deleteCategoryChildren(category.children, id);
    //   }
    // }
  }

  const handleChangeCategory = (id: number, categoryText: string) => {
    if(id === enrichedTopLevelNode.id) {
      setEnrichedTopLevelNode(enrich({
        id: 1,
        text: categoryText,
        children: categories
      }))
      return
    }
    setCategories((prevCategories) => {
      return prevCategories.map((category) => {
        if (category.id === id) {
          category.text = categoryText
          return category
        } else {
          if (category.children.length > 0) {
            updateCategoryChildren(category.children, id, categoryText);
          }
        }
        return category;
      });
    })
  }

  const updateCategoryChildren = (categoryList: Category[], id: number, categoryText: string) => {
    for (let category of categoryList) {
      // newCategory.level = newCategory.level + 1
      if (category.id === id) {
        category.text = categoryText
        return category
      } else if (category.children && category.children.length > 0) {
        updateCategoryChildren(category.children, id, categoryText);
      }
    }
  }

  const updateCategory = (categoryList: Category[], parentId: number, newCategory: Category) => {
    for (let category of categoryList) {
      // newCategory.level = newCategory.level + 1
      if (category.id === parentId) {
        category.children.push(newCategory)
        return
      } else if (category.children && category.children.length > 0) {
        updateCategory(category.children, parentId, newCategory);
      }
    }
  };

  // Flatten nodes with a depth first search
  function flatten(node: Category | EnrichedCategory): EnrichedCategory[] {
    const { children = [], ...nodeWithoutChildren } = node
    return [
      { ...nodeWithoutChildren },
      ...children.map((childNode) => flatten(childNode)).flat(),
    ] as EnrichedCategory[]
  }

  // const [scale, setScale] = useState<number>(1)
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
        // setPosition()
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
          topLevelNode={enrichedTopLevelNode}
          handleAddCategory={handleAddCategory}
          flatten={flatten}
          scale={scale}
        />
      </div>
    </div>
  </>
};

export default App;