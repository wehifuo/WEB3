 const notes = ['do', 're', 'mi', 'fa', 'salt', 'la', 'c'];
        const soundFiles = {
            'do':   './sounds/do.mp3',
            're':   './sounds/re.mp3',
            'mi':   './sounds/mi.mp3',
            'fa':   './sounds/fa.mp3',
            'salt': './sounds/salt.mp3',
            'la':   './sounds/la.mp3',
            'c':    './sounds/c.mp3'
        };
        let sequence = [];
        let userSequence = [];
        let sequenceLength = 3;
        let isPlaying = false;


        const piano = document.getElementById('piano');
        document.querySelectorAll('#piano div').forEach(key => {
            key.addEventListener('click', () => handleKeyPress(key.id));
        });

        
        async function loadSound(note) {
            try {
                const response = await fetch(soundFiles[note]);
                if (!response.ok) throw new Error(`Ошибка загрузки звука для ноты ${note}`); //если ноты не загрузились
                const sound = new Audio(soundFiles[note]);
                return sound;
            } catch (error) {
                console.error(error);
                return null;
            }
        }

        
        async function playSound(note) {
            const sound = await loadSound(note);
            if (sound) {
                sound.currentTime = 0; 
                sound.play();
            }
        }

        
        function generateSequence(length) {
            sequence = [];
            for (let i = 0; i < length; i++) {
                const randomNote = notes[Math.floor(Math.random() * notes.length)];
                sequence.push(randomNote);
            }
        }

        
        async function playSequence() {
            isPlaying = true;
            document.getElementById('status').innerText = 'Слушайте и повторяйте!';
            for (const note of sequence) {
                await playSound(note);
                const key = document.querySelector(`[id="${note}"]`);
                key.classList.add('bg-yellow-300');
                await new Promise(resolve => setTimeout(resolve, 500)); 
                key.classList.remove('bg-yellow-300');
                await new Promise(resolve => setTimeout(resolve, 600)); 
            }
            isPlaying = false;
            document.getElementById('status').innerText = 'Ваш ход!';
        }

        
        function handleKeyPress(note) {
            if (isPlaying) return; //если запущено выйдет выйдет из функции
            playSound(note);
            userSequence.push(note);

            
            if (userSequence[userSequence.length - 1] !== sequence[userSequence.length - 1]) {
                document.getElementById('status').innerText = 'Ошибка. Попробуйте снова.';
                userSequence = [];
                setTimeout(playSequence, 2000);
                return;
            }

            
            if (userSequence.length === sequence.length) {
                document.getElementById('status').innerText = 'Молодец. Следующий уровень';
                sequenceLength++;
                document.getElementById('record').innerText = 'Комбо  ' + (sequenceLength - 3);
                userSequence = [];
    
                generateSequence(sequenceLength);
                setTimeout(playSequence, 1000);
            }
        }

        
        document.getElementById('startButton').addEventListener('click', () => {
            sequenceLength = 3;
            userSequence = [];
            generateSequence(sequenceLength);
            playSequence();
        });