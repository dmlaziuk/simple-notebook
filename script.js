Vue.filter('date', time => moment(time).format('DD/MM/YY, HH:mm'))

// New VueJS instance
new Vue({
    name: 'notebook',
    // CSS selector of the root DOM element
    el: '#notebook',
    // Some data
    data () {
        return {
            notes: JSON.parse(localStorage.getItem('notes')) || [],
            // Id of the selected note
            selectedId: localStorage.getItem('selected-id') || null
        }
    },
    // Computed properties
    computed: {
        selectedNote () {
            // We return the matching note with selectedId
            return this.notes.find(note => note.id === this.selectedId)
        },
        notePreview () {
            // Markdown rendered to HTML
            return this.selectedNote ? marked(this.selectedNote.content) : ''
        },
        addButtonTitle () {
            return this.notes.length + ' note(s) already'
        },
        sortedNotes () {
            return this.notes.slice()
                .sort((a, b) => a.created - b.created)
                .sort((a, b) => (a.favorite === b.favorite) ? 0
                    : a.favorite? -1
                    : 1)
        },
        linesCount () {
            if (this.selectedNote) {
              // Count the number of new line characters
              return this.selectedNote.content.split(/\r\n|\r|\n/).length
            }
          },
          wordsCount () {
            if (this.selectedNote) {
              var s = this.selectedNote.content
              // Turn new line cahracters into white-spaces
              s = s.replace(/\n/g, ' ')
              // Exclude start and end white-spaces
              s = s.replace(/(^\s*)|(\s*$)/gi, '')
              // Turn 2 or more duplicate white-spaces into 1
              s = s.replace(/[ ]{2,}/gi, ' ')
              // Return the number of spaces
              return s.split(' ').length
            }
          },
          charactersCount () {
            if (this.selectedNote) {
              return this.selectedNote.content.split('').length
            }
        }
    },
    watch: {
        notes: {
            handler: 'saveNotes',
            // We need this to watch each note's properties inside the array
            deep: true
        },
        // Let's save the selection too
        selectedId (val, oldVal) {
            localStorage.setItem('selected-id', val)
        }
    },
    methods: {
        // Add a note with some default content and select it
        addNote () {
            const time = Date.now()
            // Default new note
            const note = {
                id: String(time),
                title: 'New note ' + (this.notes.length + 1),
                content: '**Hi!** This notebook is using [markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) for formatting!',
                created: time,
                favorite: false
            }
            // Add to the list
            this.notes.push(note)
            // Select
            this.selectNote(note)
        },
        selectNote (note) {
            this.selectedId = note.id
        },
        saveNotes () {
            // Don't forget to stringify to JSON before storing
            localStorage.setItem('notes', JSON.stringify(this.notes))
        },
        // Remove the selected note and select the next one
        removeNote () {
            if (this.selectedNote && confirm('Delete the note?')) {
                // Remove the note in the notes array
                const index = this.notes.indexOf(this.selectedNote)
                if (index !== -1) {
                    this.notes.splice(index, 1)
                }
            }
        },
        favoriteNote () {
            this.selectedNote.favorite ^= true
        }
    }
})
