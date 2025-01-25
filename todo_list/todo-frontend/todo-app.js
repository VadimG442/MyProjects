(function() {
  // создаём заголовок
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title; // наполняем заголовок аргументом функции
    return appTitle; 
  }

  // создаём форму 
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    // стилизуем элементы формы с помощью готовых стилей bootstrap
    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.disabled = true;
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';

    // помещаем созданные элементы в форму
    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    // задаём поведение кнопки при событии input у поля
    input.addEventListener('input', function() {
      if (input.value !== '') {
        button.disabled = false;
      } else {
        button.disabled = true;
      }
    })

    return {
      form,
      input,
      button,
    } // возвращаем созданные элементы в виде объекта
  }

  // создаём непосредственно лист с задачами
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  // создаём элементы списка внутри листа задач
  function createTodoItem(task) {
    let item = document.createElement('li');

    // создаём контейнер кнопок с самими кнопками
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    // стилизуем элемент списка с помощью готовых стилей bootstrap
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = task.name; /* элемент списка примет как "заголовок" значение аргумента, 
                                используем textContent для "безопасного" наполнения */

    // стилизуем блок кнопок через bootstrap
    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    if (task.done == true) {
      item.classList.add('list-group-item-success');
    } 

    doneButton.addEventListener('click', function() {
      item.classList.toggle('list-group-item-success');
      if (!task.done) {
        task.done = true;
      } else { 
        task.done = false; 
      }
      saveList(taskArr, listName)
    })

    deleteButton.addEventListener('click', function() {
      if (confirm('Вы уверены?')) {
        item.remove();
        for (let i = 0; i < taskArr.length; i++) {
          if (taskArr[i].id == task.id) {
            taskArr.splice(i, 1)
          }
        }
      }
      saveList(taskArr, listName)
    })

    // наполняем созданный li получившимися элементами
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton,
    } // так же возвращаем результат в виде объекта
  }
  
  let taskArr = [];
  let listName = ''; // наполняемая переменная, которая будет выведена в localStorage

  // функция, принимающая в виде аргумента некий массив, где мы создаём переменную
  // с начальным значением, далее, внутри цикла который проходит по всему массиву,
  // мы ищем элемент с наибольшим id и если он больше нашей переменной, присваиваем
  // ей значение id этого элемента, а из функции выводим это значение +1, тем самым 
  // генерируем новый id
  function createObjId(arr) {
    let maxId = 0;
    for (let max of arr) {
      if (max.id > maxId) {
        maxId = max.id;
      }
    }
    return maxId + 1;
  }

  // функция, принимающая за аргументы некий массив и какое то значение keyName,
  // далее в localStorage помещаем следующее: преобразованный в строку массив под ключом keyName.
  // теперь, везде, где нам нужно получить данные в localStorage, вызываем эту функцию, задаём
  // аргументы, и она сама будет всё преобразовывать
  function saveList(arr, keyName) {
    localStorage.setItem(keyName, JSON.stringify(arr))
  }

  // создаём отдельную функцию принимающую за аргумент контейнер, внутрь которого запушим весь результат,
  // а так же заголовок, имеющий значение по умолчанию 
  function createTodoApp(container, title = 'Список дел', keyName) {
    
    // передаём функции в переменные
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    listName = keyName; // в localStorage ключ будет принимать значение из аргумента функции

    // наполняем заранее переданный нами в виде аргумента к функции контейнер
    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    let localData = localStorage.getItem(listName)
    if (localData !== null && localData !== '') {
      taskArr = JSON.parse(localData);
    }

    for (let itemList of taskArr) {
      let localItem = createTodoItem(itemList);
      todoList.append(localItem.item)
    }

    /* теперь задаём поведение формы при событии submit,
       при этом, так как todoItemForm у нас выведен в виде объекта,
       мы обращаемся конкретно к ФОРМЕ через её ключ.
    */
    todoItemForm.form.addEventListener('submit', function(e) {
      e.preventDefault(); // отменяем поведение формы по умолчанию
      
      // если в форму не введено никакое значение, функция не идёт дальше
      if (!todoItemForm.input.value) {
        return;
      } 

      let taskObj = {
        id: createObjId(taskArr),
        name: todoItemForm.input.value,
        done: false,
      }

      let taskItem = createTodoItem(taskObj);

      // пушим результат в список
      todoList.append(taskItem.item);

      todoItemForm.button.disabled = true;
      // очищаем поле ввода
      todoItemForm.input.value = '';

      taskArr.push(taskObj);

      saveList(taskArr, listName)
    })
  }

  window.createTodoApp = createTodoApp;
}) ();