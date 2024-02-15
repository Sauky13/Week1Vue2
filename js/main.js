Vue.component('note-board', {
  template: `
    <div class="container">
      <div class="form">
        <input type="text" v-model="newCardTitle" @keyup.enter="addCard" placeholder="название карточки">
        <button @click="addCard">Добавить</button>
      </div>
      <note-column :cards="cards" @add-card="addCard"></note-column>
    </div>
  `,
  data() {
    return {
      newCardTitle: '', // Заголовок новой карточки
      cards: [] // Массив для хранения карточек
    };
  },
  methods: {
    addCard() { // Метод для добавления новой карточки
      if (this.newCardTitle.trim() !== '') {
        this.cards.push({ // Добавляем карточку
          title: this.newCardTitle.trim(),
          items: ['Пункт 1', 'Пункт 2', 'Пункт 3'],
          checkedItems: [false, false, false],
          column: 0,
        });
        this.newCardTitle = '';
      }
    },
  },
});


Vue.component('note-column', {
  props: ['cards'],
  template: `
    <div class="note-column">
      <note-card percent="0%" :cards="cards"></note-card>
      <note-card percent="50%" :cards="cards"></note-card>
      <note-card percent="100%" :cards="cards"></note-card>
    </div>
  `,
});

Vue.component('note-card', {
  props: ['percent', 'cards'],
  template: `
    <div class="note-card">
      <h2>{{ percent }}</h2>
      <note-list :cards="filteredCards"></note-list>
    </div>
  `,
  computed: {
    filteredCards() {
      return this.cards.filter(card => card.column === parseInt(this.percent));
    }
  }
});

Vue.component('note-list', {
  props: ['cards'],
  data() {
    return {
      newItem: '',
      editedIndex: -1,
      editedItem: ''
    };
  },
  methods: {
    addItem(cardIndex) {
      const newItemText = this.newItem.trim();
      if (newItemText !== '') {
        const card = this.cards[cardIndex];
        if (card.items.length < 5) { // Проверка на максимальное количество пунктов
          card.items.push(newItemText);
          card.checkedItems.push(false);
          this.newItem = '';
        } else {
          card.full = true; // Установка флага, что карточка полная
        }
      }
    },
    editItem(itemIndex, item) {
      this.editedIndex = itemIndex;
      this.editedItem = item;
    },
    doneEdit(cardIndex) {
      if (!this.editedItem) {
        return;
      }
      this.cards[cardIndex].items.splice(this.editedIndex, 1, this.editedItem);
      this.editedIndex = -1;
      this.editedItem = '';
    }
  },
  template: `
    <div>
      <div v-for="(card, index) in cards" :key="index" class="card">
        <h3>{{ card.title }}</h3>
        <input type="text" v-model="newItem" @keyup.enter="addItem(index)" placeholder="Новый пункт">
        <button @click="addItem(index)" :disabled="card.full">Добавить</button>
        <ul>
          <li v-for="(item, itemIndex) in card.items" :key="itemIndex">
            <span v-if="editedIndex !== itemIndex">
              <input type="checkbox" v-model="card.checkedItems[itemIndex]">
              <span @click="editItem(itemIndex, item)">{{ item }}</span>
            </span>
            <span v-else>
              <input type="text" v-model="editedItem" @blur="doneEdit(index)" @keyup.enter="doneEdit(index)">
            </span>
          </li>
        </ul>
      </div>
    </div>
  `,
});

new Vue({
  el: '#app',
});



  
  
  


