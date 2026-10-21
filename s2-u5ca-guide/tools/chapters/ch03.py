# Chapter 3, Global.cs (DESIGN_SPEC §9 ch03, voice §7a). The fourteen fields live in content/code/Global/fields.cs, grouped
# in the order the three code screens teach them. Run by tools/build_content.py with its helpers.
G = 'Global'
WHERE = "between the curly brackets of public class Global, in Global.cs"
CH = {
 "id": "03", "n": 3, "of": 15, "title": "Global.cs: the file that remembers things between forms", "kind": "expected", "color": "#2A9D8F",
 "one": "One file that every form can read and write.",
 "prev": {"id": "02", "n": 2, "title": "The data entry form: its panels and boxes"},
 "next": {"id": "04", "n": 4, "title": "Pupil details: the Enter button"},
 "methods": [["Global", "fields"]],
 "stages": [
  {"id": "1", "title": "Check what your Global.cs has", "thing": "your Global.cs so far", "verb": "checking", "screens": [
   {"id": "1", "title": "Check what your Global.cs already has", "foot": "have", "done": "every row is ticked, or you have gone where its link says",
    "goal": "I check for a Global.cs file that says public class Global and holds all fourteen public static lines.",
    "blocks": [
    {"p": "Your project may have Global.cs already, so this screen checks what is there."},
    {"check": [
     have("1-1.t1", "In Solution Explorer, is there a file called Global.cs?",
          "Solution Explorer is on the right. Look down its list of files.", "Go to part 2.", "#cw/03/2-1"),
     have("1-1.t2", "Double-click Global.cs. Does it say public class Global?",
          "Look at the top of the file, a few lines down.", "Go to part 2, screen 3.", "#cw/03/2-3"),
     have("1-1.t3", "Is there a public static line for surname, attempt1, quizScore and the eleven others?",
          "All fourteen names are on part 3. Check each one.", "Go to part 3.", "#cw/03/3-1"),
     have("1-1.t4", "Click the Build menu, then Build Solution. Does the bottom bar say Build succeeded?",
          "The Build menu is along the top of Visual Studio.", "Go to chapter 0, part 3.", "#cw/00/3-1")]}
   ]}]},
  {"id": "2", "title": "Add the Global.cs file", "thing": "the Global.cs file", "verb": "making", "screens": [
   opener("Add a file called Global.cs that every form can read", "This part adds one new file to your project. It is called Global.cs.",
           "A form forgets everything when it closes. Global.cs never closes, so it keeps what every form needs.",
           "When it works, Global.cs sits in Solution Explorer. Its first line says public class Global."),
   {"id": "1", "title": "Meet the three new words", "foot": "next", "done": "you have read what Global, variable and static mean",
    "goal": "I meet the words Global, variable and static before I use them.",
    "blocks": [
    {"p": "This chapter uses three new words, and this screen says what each one means."},
    {"words": [
      ["Global", "The file every form can read and write in.", "2-2", True],
      ["variable", "A name that holds one thing, like a score.", "2-2", True],
      ["static", "There is only one of it. Every form sees the same one.", "2-2", True]],
     "intro": "Three new words in this chapter. Click any marked word to see what it means."},
   ]},
   {"id": "2", "title": "See why the score goes into Global.cs", "foot": "next", "done": "you have looked at the picture and read the two lines under it",
    "goal": "A form forgets everything when it closes, so Global.cs keeps what every form needs.",
    "blocks": [
    {"p": "A form forgets everything when it closes, so the quiz score would be gone with it."},
    {"drawn": {"id": "notebook", "alt": "The quiz form fades away. Its score card drops into Global.cs, which keeps it.",
               "say": "The quiz form closes. Its score drops into Global.cs, and Global.cs keeps it."}},
    {"p": "[[Global|0]] is that file. It is called Global.cs."},
    {"p": "Each line in it is a [[variable|1]]. [[static|2]] means there is only one, shared by every form."},
    {"watch": "Global.cs holds no controls. It has no Design tab. It is only code."}
   ]},
   {"id": "3", "title": "Add Global.cs to your project", "foot": "done", "done": "the line at the top of Global.cs says public class Global",
    "goal": "I add a class called Global and put the word public in front of class.",
    "blocks": [
    {"p": "Visual Studio makes the new file for you, and you change one word in it."},
    {"steps": [
     step("2-2.1", "Click the Project menu along the top. Click Add Class.",
          "A box opens with Class picked in its list.",
          None, [["I cannot see Add Class.", "Click your project's name in Solution Explorer first. Then open the Project menu again."]]),
     step("2-2.2", "In the Name box at the bottom, type Global.cs. Click Add.",
          "Global.cs opens in the code tab. It says class Global."),
     step("2-2.3", "Click in front of the word class. Type the word public and a space.",
          "The line now says public class Global.")]},
    {"box": {"title": "See it in Visual Studio", "fold": True, "blocks": [
      frames("F6", "Add a class called Global", watch="Watch for the Name box at the bottom of the Add box", fr=[
        ("f6-1", "The Project menu open, with Add Class in its list", "Open the Project menu. Click Add Class."),
        ("f6-2", "The Add New Item box with Class picked and Global.cs in the Name box", "Class is picked. Type Global.cs in the Name box."),
        ("f6-3", "The new Global.cs in the code tab, showing class Global", "Click Add. Global.cs opens in the code tab.")])]}},
    {"watch": "Type public in front of class. Without it, your other forms may not find Global."}
   ]}]},
  {"id": "3", "title": "The fourteen variables", "thing": "the fourteen variables", "verb": "making", "screens": [
   opener("Type the fourteen variables into Global.cs", "This part types fourteen lines into Global.cs. Each line keeps one thing about the pupil.",
           "The lines come in three groups: the details, the attempts, then the quiz, test and group.",
           "When it works, Global.cs has fourteen lines that all start public static. The project builds."),
   {"id": "1", "title": "Keep the pupil's details in Global.cs", "foot": "done", "done": "lines 1 to 4 are typed and the code has no red squiggles",
    "goal": "Global.cs holds four string variables for the surname, first name, year group and gender, each starting empty.",
    "blocks": [
    {"p": "Every line in Global.cs has the same shape, so this screen explains it once."},
    {"p": "public means every form may use it. static means there is only one. string means words."},
    code("3-1.c1", "Global.cs: code 1 of 3", WHERE, G, "fields", 1, 4,
         [[1, 1, "The shape of every line", "public static, then the kind, then the name. = \"\" means it starts empty."],
          [2, 4, "Three more for the pupil", "The first name, the year group and the gender. Each one is words, so each is a string."]],
         ["Global.surname", "Global.firstname", "Global.yearGroup", "Global.gender"], ["string"]),
    {"watch": "Each line ends with a semicolon. A missing one gives a red line."}
   ]},
   {"id": "2", "title": "Keep the three attempts and their average", "foot": "done", "done": "lines 5 to 9 are typed and the code has no red squiggles",
    "goal": "Global.cs holds three int attempts, a double average and a bool that says if the average is worked out.",
    "blocks": [
    {"p": "Next come the three attempts and their average, which are numbers, not words."},
    code("3-2.c1", "Global.cs: code 2 of 3", "under code 1, " + WHERE, G, "fields", 5, 9,
         [[5, 7, "The three attempts", "Each attempt is a whole number, so each is an int. Each starts at 0."],
          [8, 8, "The average", "A double can have a point, like 4.5. An average often does."],
          [9, 9, "Is the average worked out yet?", "A bool is true or false. It starts false. Chapter 5 sets it to true."]],
         ["Global.attempt1", "Global.attempt2", "Global.attempt3", "Global.average", "Global.averageCalculated"], ["int"],
         yours="MY three attempts are swim lengths. attempt1, attempt2 and attempt3 fit any task, so keep these names."),
    {"watch": "average is a double, not an int. An int would lose the point."}
   ]},
   {"id": "3", "title": "Keep the quiz, the reaction test and the group", "foot": "done", "done": "all fourteen lines are typed and the code has no red squiggles",
    "goal": "Global.cs holds the quiz score, the reaction test score, a bool for each saying it is taken, and the group.",
    "blocks": [
    {"p": "Last come the quiz, the reaction test and the group the pupil goes in."},
    code("3-3.c1", "Global.cs: code 3 of 3", "under code 2, " + WHERE, G, "fields", 10, 14,
         [[10, 11, "The quiz", "quizScore holds the score. quizTaken turns true once the quiz is done."],
          [12, 13, "The reaction test", "The same two again, for the reaction test."],
          [14, 14, "The group", "assignedGroup holds the group the pupil is put in. It is words."]],
         ["Global.quizScore", "Global.quizTaken", "Global.reactionTestScore", "Global.reactionTestTaken", "Global.assignedGroup"], ["bool"]),
    {"p": "That makes fourteen lines. Count yours."}
   ]}]},
  {"id": "4", "title": "Try it", "thing": "your Global.cs", "verb": "testing", "screens": [
   {"id": "1", "title": "Check every form can find your fourteen variables", "foot": "chapter-done", "done": "every row is ticked, or you have gone where its link says",
    "goal": "The project builds, and typing Global and a full stop in another form lists all fourteen names.",
    "blocks": [
    {"p": "These checks happen in Visual Studio, so the program does not need to run."},
    {"check": [
     tryit("4-1.t1", "Click the Build menu, then Build Solution.",
           "The bottom bar says Build succeeded.", "Look at the line with the red mark. Then go to part 3.", "#cw/03/3-1", code=True),
     tryit("4-1.t2", "Double-click the Login button on YOUR login form. Click an empty line in its code. Type Global and a full stop.",
           "A list pops up with YOUR fourteen names in it. Then delete what you typed.", "Check each line starts public static. Go to part 3.", "#cw/03/3-1", code=True),
     tryit("4-1.t3", "Take the word static off one line and build. Type Global and a full stop again.",
           "That name must NOT be in the list. Put static back afterwards.", "If the name is still there, build again first. Then look at part 3.", "#cw/03/3-1", neg=True, code=True)]}
   ]}]}
 ]}
