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

        if (
            (this.cards.length < 3 || columnCounts[50] < 5 || columnCounts[100] < this.cards.length - 5) &&
            (this.cards.filter(card => card.column === 0).length < 3 ||
                (this.cards.filter(card => card.column === 100).length > 0 && columnCounts[0] < 3)) &&
            !(this.cards.filter(card => card.column === 50).length >= 5)
        ) {
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
      editedIndex: {},
      editedItem: {}
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
    editItem(cardIndex, itemIndex, item) {
      this.$set(this.editedIndex, cardIndex, itemIndex);
      this.$set(this.editedItem, cardIndex, item);
    },
    doneEdit(cardIndex) {
      const itemIndex = this.editedIndex[cardIndex];
      const editedItem = this.editedItem[cardIndex];
      if (!editedItem) {
        return;
      }
      this.cards[cardIndex].items.splice(itemIndex, 1, editedItem);
      this.$delete(this.editedIndex, cardIndex);
      this.$delete(this.editedItem, cardIndex);

      this.$emit('save-items');
    },
    checkCardStatus(cardIndex) {
      const card = this.cards[cardIndex];
      const checkedCount = card.checkedItems.filter(item => item).length;
      const totalItems = card.items.length;
      const percentChecked = (checkedCount / totalItems) * 100;

      const updateCardPosition = (newColumn, setLastChecked) => {
        card.column = newColumn;
        const formatter = new Intl.DateTimeFormat('ru', {
          year: '2-digit',
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
        if (setLastChecked) {
          const now = new Date();
          card.lastChecked = formatter.format(new Date());
        } else {
          card.lastChecked = null;
        }
      };
      if (card.column === 0) {
        if (percentChecked >= 50) {
          updateCardPosition(50, percentChecked === 100);
        }
      } else if (card.column === 50) {
        if (percentChecked < 50) {
          updateCardPosition(0, false);
        } else if (percentChecked === 100) {
          updateCardPosition(100, true);
        }
      } else if (card.column === 100) {
        if (percentChecked < 100) {
          updateCardPosition(50, false);
        }
      }
      this.$emit('save-items');
    },
  },
  template: `
    <div>
      <div v-for="(card, cardIndex) in cards" :key="cardIndex" class="card" :class="{ 'column-50': card.column === 50 }">
        <h3>{{ card.title }}</h3>
        <input id="input-item" type="text" v-model="newItems[cardIndex]" @keyup.enter="addItem(cardIndex)" placeholder="название пункта">
        <button @click="addItem(cardIndex)" :disabled="card.full">+</button>
        <ul>
          <li v-for="(item, itemIndex) in card.items" :key="itemIndex">
            <span v-if="editedIndex[cardIndex] !== itemIndex">
              <input type="checkbox" v-model="card.checkedItems[itemIndex]" @change="checkCardStatus(cardIndex)">
              <span @click="editItem(cardIndex, itemIndex, item)">{{ item }}</span>
            </span>
            <span v-else>
              <input id="input-edit-item" type="text" v-model="editedItem[cardIndex]" @blur="doneEdit(cardIndex)" @keyup.enter="doneEdit(cardIndex)">
            </span>
          </li>
        </ul>
        <div v-if="card.lastChecked"><p>Выполнено {{ card.lastChecked }}</p></div>
      </div>
    </div>
  `,
});

new Vue({
  el: '#app',
});



  
  
  


