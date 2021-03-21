import React, {useState} from "react";
import './App.css';

const height = 400;
const itemHeight = 30;

/**
 * 简单实现一个虚拟列表，DOM结构如下
 * <view-list-container>  容器 监听滚动事件，通过scrollTop不断地计算出现的列表
 *     <virtual-list-phantom/>  将容器撑开，让容器出现滚动条
 *     <list-content>           真实的可视区域，需要不断的根据滚动距离调整自身的位置  也就是说 自身位置的调整和下面元素的补充是一起出现的  具体可以运行起来观察DOM元素的变化
 *         <item>
 */

function App() {
  //列表初始化
  const [list,] = useState(() => {
    const res = [];
    for (let i = 0; i < 1000; i++) {
      res[i] = {
        height: itemHeight,
        text: i,
      }
    }
    return res;
  })

  //控制可见区域的相对位置
  const ref = React.useRef({});

  //控制虚拟列表中的子列表
  const [realList, setRealList] = useState([...list.slice(0, Math.ceil(height / itemHeight))]);

  // 主要函数：做了两件事：
  // 1. 实时调整列表的值
  // 2. 滑动过程中 content会因为滑走的元素产生误差，这时候需要实时调整误差
  const handleScroll = React.useCallback((e) => {
    const scrollTop = e.target.scrollTop;

    const fixScrollTop = scrollTop - scrollTop % itemHeight;

    ref.current.style.webkitTransform = `translate3d(0, ${fixScrollTop}px, 0)`;

    const items = Math.ceil(height / itemHeight);
    const startIdx = Math.floor(scrollTop / itemHeight);
    const realList = list.slice(startIdx, items + startIdx);
    setRealList(realList);
  }, [list]);

  return (
      <>
        <div className="App">
          虚拟列表
        </div>
        <div>
          <div className={'view-list-container'} style={{height: '400px', width: '300px'}}
               onScroll={handleScroll}>
            <div className={'virtual-list-phantom'}
                 style={{height: `${list.length * list[0]?.height || 0}px`}}/>
            <div ref={ref} className={'list-content'} >
              {realList.map(({text}) => (
                  <div className={'list-item'} key={'list' + text}>
                    {text}
                  </div>
              ))
              }
            </div>
          </div>
        </div>
        <div>
          结束虚拟列表
        </div>
      </>
  );
}


export default App;
