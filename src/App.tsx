import { useEffect } from 'react';
import { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';

function App() {
  const [todos, setTodos] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const localData = localStorage.getItem('todos');
    if (localData) {
      console.log(localData);
      //   setTodos(JSON.parse(localData));
    }
  }, []);

  const onChange = ({ target: { value } }: { target: { value: string } }) => {
    setInputValue(value);
  };

  const onKeyPress = ({ key }: { key: string }) => {
    if (key === 'Enter') {
      addTodo();
    }
  };

  const addTodo = () => {
    setTodos(prev => [...prev, inputValue]);
    setInputValue('');
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo !== id));
  };

  const handleChange = (result: any) => {
    if (!result.destination) return;
    const items = [...todos];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTodos(items);
  };

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  return (
    <Container>
      <Input type='text' onChange={onChange} onKeyPress={onKeyPress} value={inputValue} />
      <DragDropContext onDragEnd={handleChange}>
        <Droppable droppableId='todos'>
          {provided => (
            <ul className='todos' {...provided.droppableProps} ref={provided.innerRef}>
              {todos?.map((todo, index) => (
                <Draggable key={index} draggableId={String(index)} index={index}>
                  {provided => (
                    <Li
                      ref={provided.innerRef}
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                    >
                      {todo}
                      <DeleteButton onClick={() => deleteTodo(todo)}>X</DeleteButton>
                    </Li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  );
}

export default App;

const Container = styled.div`
  width: 350px;
  height: 500px;
  & * {
    box-sizing: border-box;
  }
  & ul {
    margin: 0;
    padding: 0;
  }
`;

const Li = styled.li`
  width: 300px;
  height: 50px;
  border: 1px solid black;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const DeleteButton = styled.button`
  position: absolute;
  border: none;
  background: none;
  right: 10px;
  cursor: pointer;
`;

const Input = styled.input`
  width: 300px;
  height: 50px;
  border: 1px solid black;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  outline: none;
`;
