Vue.component('note-list', {
  data() {
    return {
      newCardTitle: '',
      cards: [], // Массив для хранения карточек
    };
  },
  methods: {
    addCard() { // Метод для добавления новой карточки
      if (this.newCardTitle.trim() !== '') {
        this.cards.push({
          title: this.newCardTitle.trim(),
          items: [], // Пустой массив для хранения элементов карточки
          checkedItems: [], // Пустой массив для хранения состояний чекбоксов элементов карточки
          column: 0,
        });
        this.newCardTitle = '';
      }
    },
    addItem(cardIndex, newItem) { // Метод для добавления нового элемента в карточку
      if (newItem.trim() !== '') {
        const card = this.cards[cardIndex];
        card.items.push(newItem.trim());
        card.checkedItems.push(false);
      }
      this.newItem = '';
    },
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
  
  
  
  


