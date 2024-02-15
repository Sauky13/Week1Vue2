Vue.component('note-list', {
    data() { // Определение локальных данных компонента
      return {
        newCardTitle: '',
        cards: [], // Массив для хранения карточек
      };
    },
    template: ` 
      <div>
        <input type="text" v-model="newCardTitle" @keyup.enter="addCard" placeholder="Название карточки"> 
        <button @click="addCard">Добавить</button>
        <div v-for="(card, index) in cards" :key="index" class="card"> 
          <h3>{{ card.title }}</h3> 
          <input type="text" v-model="newItem" @keyup.enter="addItem(index, newItem)" placeholder="Новый пункт">
          <button @click="addItem(index, newItem)">Добавить</button> 
          <ul>
            <li v-for="(item, itemIndex) in card.items" :key="itemIndex"> 
              <input type="checkbox" :id="item" v-model="card.checkedItems[itemIndex]"> 
              <label :for="item">{{ item }}</label> 
            </li>
          </ul>
        </div>
      </div>
    `,
  });
  
  Vue.component('note-card', { 
    props: ['percent'], 
    template: ` 
      <div class="note-card">
        <h2>{{ percent }}</h2> 
        <note-list></note-list> 
      </div>
    `,
  });
  
  Vue.component('note-column', { 
    template: `
      <div class="note-column">
        <note-card percent="0%"></note-card> 
        <note-card percent="50%"></note-card> 
        <note-card percent="100%"></note-card> 
      </div>
    `,
  });
  
  new Vue({ 
    el: '#app', 
  });
  
  
  
  


