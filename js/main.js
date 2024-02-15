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
      newCardTitle: '',
      cards: JSON.parse(localStorage.getItem('cards')) || []
    };
  },
  methods: {
    addCard() {
      if (this.newCardTitle.trim() !== '') {
        const columnCounts = this.cards.reduce((acc, card) => {
          acc[card.column] = (acc[card.column] || 0) + 1;
          return acc;
        }, {});

        if (this.cards.length < 3 || columnCounts[50] < 5 || columnCounts[100] < this.cards.length - 5) {
          this.cards.push({
            title: this.newCardTitle.trim(),
            items: ['Пункт 1', 'Пункт 2', 'Пункт 3'],
            checkedItems: [false, false, false],
            column: 0,
          });
          this.newCardTitle = '';

          if (this.cards.length === 4 && columnCounts[0] === 3) {
            this.cards.forEach(card => {
              if (card.column === 0) {
                card.column = 50;
              }
            });
          }

          localStorage.setItem('cards', JSON.stringify(this.cards));
        }
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
      <note-list :cards="filteredCards" @save-items="saveItems"></note-list>
    </div>
  `,
  computed: {
    filteredCards() {
      return this.cards.filter(card => card.column === parseInt(this.percent));
    }
  },
  methods: {
    saveItems() {
      localStorage.setItem('cards', JSON.stringify(this.cards));
    }
  }
});

Vue.component('note-list', {
  props: ['cards'],
  data() {
    return {
      newItems: {},
      editedIndex: -1,
      editedItem: ''
    };
  },
  methods: {
    addItem(cardIndex) {
      const newItemText = this.newItems[cardIndex] ? this.newItems[cardIndex].trim() : '';
      if (newItemText !== '') {
        const card = this.cards[cardIndex];
        if (card.items.length < 5) {
          card.items.push(newItemText);
          card.checkedItems.push(false);
          this.$set(this.newItems, cardIndex, '');
        } else {
          card.full = true;
        }
        this.$emit('save-items');
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

      this.$emit('save-items');
    },
    checkCardStatus(cardIndex) {
      const card = this.cards[cardIndex];
      const checkedCount = card.checkedItems.filter(item => item).length;
      const totalItems = card.items.length;
      const percentChecked = (checkedCount / totalItems) * 100;
      if (percentChecked >= 50 && card.column === 0) {
        card.column = 50;
      }
      else if (percentChecked === 100 && card.column <= 50) {
        card.column = 100;
      }
      else if (percentChecked === 0 && card.column > 0) {
        card.column = 0;
      }
      this.$emit('save-items');
    },
  },
  template: `
    <div>
      <div v-for="(card, index) in cards" :key="index" class="card" :class="{ 'column-50': card.column === 50 }">
        <h3>{{ card.title }}</h3>
        <input type="text" v-model="newItems[index]" @keyup.enter="addItem(index)" placeholder="название пункта">
        <button @click="addItem(index)" :disabled="card.full">Добавить</button>
        <ul>
          <li v-for="(item, itemIndex) in card.items" :key="itemIndex">
            <span v-if="editedIndex !== itemIndex">
              <input type="checkbox" v-model="card.checkedItems[itemIndex]" @change="checkCardStatus(index)">
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



  
  
  


