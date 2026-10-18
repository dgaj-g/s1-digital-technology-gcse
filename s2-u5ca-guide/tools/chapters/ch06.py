# Chapter 6, the quiz: the first three questions (DESIGN_SPEC §9 ch06, voice §7a). Run by tools/build_content.py with its helpers.
D = 'frmDataEntry'
Q = 'frmQuiz'
C1 = "inside btnCheck1_Click, in frmQuiz.cs"
C3 = "inside btnCheck3_Click"
CH = {
 "id": "06", "n": 6, "of": 15, "title": "The quiz: the first three questions", "kind": "expected", "color": "#D1495B",
 "one": "Get to the quiz, then mark a typed answer, two buttons and a list.",
 "prev": {"id": "05", "n": 5, "title": "The average of three attempts"},
 "next": {"id": "07", "n": 7, "title": "The quiz: questions 4 and 5, and the score"},
 "methods": [[D, "btnTakeQuiz_Click"], [Q, "btnCheck1_Click"], [Q, "btnCorrect_Click"], [Q, "btnIncorrect_Click"], [Q, "btnCheck3_Click"]],
 "stages": [
  {"id": "1", "title": "Check what your quiz has", "screens": [
   {"id": "1", "title": "Check what your quiz already has", "foot": "have",
    "goal": "I check for the quiz form and its six panels, the Take quiz button, and the marking of questions 1, 2 and 3.",
    "blocks": [
    {"p": "Your quiz may be partly made already. This screen checks what is there."},
    {"check": [
     have("1-1.t1", "Is frmQuiz in Solution Explorer? Does it hold a score panel and five question panels?",
          "Double-click frmQuiz in Solution Explorer. It opens in the Design tab.", "Go to stage 2.", "#cw/06/2-1"),
     have("1-1.t2", "Does question 4 have four round buttons and a Check button? Does question 5 have a number box?",
          "Click each control once. Its name shows near the top of Properties.", "Go to stage 2, screen 4.", "#cw/06/2-4"),
     have("1-1.t3", "Run it. Does the Take quiz button open the quiz?",
          "Use the green Start arrow. Log in and fill in the data entry form first.", "Go to stage 3.", "#cw/06/3-1"),
     have("1-1.t4", "Answer question 1 and press Check. Does its panel turn green or red?",
          "Green means right. Red means wrong.", "Go to stage 4.", "#cw/06/4-1"),
     have("1-1.t5", "Do question 2's buttons and question 3's list mark the answer?",
          "Try each one. The panel should turn green or red.", "Go to stage 5.", "#cw/06/5-1")]}
   ]}]},
  {"id": "2", "title": "The quiz form: its panels and buttons", "screens": [
   {"id": "1", "title": "Add the quiz form and its six panels", "foot": "done",
    "goal": "I add a form called frmQuiz and put six panels on it, each named for what it holds.",
    "blocks": [
    {"p": "The quiz is a form of its own. It holds a score panel and five question panels."},
    {"steps": [
     step("2-1.1", "Click the Project menu along the top. Click the line that starts Add Form.",
          "A box opens with Form picked in its list.",
          None, [["I cannot see that line.", "Click your project's name in Solution Explorer first. Then open the Project menu again."]]),
     step("2-1.2", "In the Name box at the bottom, type frmQuiz.cs. Click Add.",
          "frmQuiz opens in the Design tab. It is empty."),
     step("2-1.3", "Drag six panels from the Toolbox onto it. Name each one as the map shows.",
          "Six panels, each with a name that starts with pnl.")]},
    {"box": {"title": "See it in Visual Studio", "fold": True, "blocks": [
      frames("F5", "Add a new form", [
        ("f5-1", "The Project menu open, with Add Form in its list", "Open the Project menu. Click the line that starts Add Form."),
        ("f5-2", "The Add New Item box with Form picked and a name in the Name box", "Form is picked. Type the form's name in the Name box."),
        ("f5-3", "The new empty form in the Design tab", "Click Add. The new form opens in the Design tab.")])]}},
    {"flow": {"form": Q, "map": True,
              "lit": ["pnlQuizScore", "pnlTextQuestion", "pnlButtonsQuestion", "pnlListQuestion", "pnlRadioQuestion", "pnlNumberQuestion"], "then": [],
              "say": "Six panels. One holds the score. Each of the other five holds one question."}},
    {"p": "Each panel is named for what is in it, not a number. So YOUR quiz can put its questions in any order."}
   ]},
   {"id": "2", "title": "Fill the score panel and the question 1 panel", "foot": "done",
    "goal": "The score panel holds the title, the score, a comment and two buttons, and question 1 holds a label, a box and Check.",
    "blocks": [
    {"p": "Drag each control into its panel. Then give it its name and its Text."},
    {"controls": {"form": Q, "rows": [
      {"toolbox": "Label", "name": "lblQuiz", "set": ["Text = Quiz"]},
      {"toolbox": "Label", "name": "lblComment", "set": ["Text = a line to start the quiz"]},
      {"toolbox": "Label", "name": "lblScore", "set": ["Text = Score:"]},
      {"toolbox": "Label", "name": "lblResult", "set": ["Text = 0"]},
      {"toolbox": "Button", "name": "btnReturn", "set": ["Text = Return"]},
      {"toolbox": "Button", "name": "btnHelpQuizScore", "set": ["Text = ?"]},
      {"toolbox": "Label", "name": "lblQuestion1", "set": ["Text = question 1"]},
      {"toolbox": "TextBox", "name": "tbxQuestion1", "set": []},
      {"toolbox": "Button", "name": "btnCheck1", "set": ["Text = Check"]}],
     "done": "The first six sit inside pnlQuizScore. The last three sit inside pnlTextQuestion."}},
    {"yours": "MY questions are about water safety. Type YOUR five questions into the Text of each question label."}
   ]},
   {"id": "3", "title": "Fill the question 2 and question 3 panels", "foot": "done",
    "goal": "Question 2 holds a label and two answer buttons, and question 3 holds a label, a picture, a list and Check.",
    "blocks": [
    {"p": "Question 2 is answered with one of two buttons. Question 3 is answered from a drop-down list."},
    {"controls": {"form": Q, "rows": [
      {"toolbox": "Label", "name": "lblQuestion2", "set": ["Text = question 2"]},
      {"toolbox": "Button", "name": "btnCorrect", "set": ["Text = the right answer"]},
      {"toolbox": "Button", "name": "btnIncorrect", "set": ["Text = a wrong answer"]},
      {"toolbox": "Label", "name": "lblQuestion3", "set": ["Text = question 3"]},
      {"toolbox": "PictureBox", "name": "pbxQuestion3", "set": ["Image = a picture for question 3"]},
      {"toolbox": "ComboBox", "name": "cbxQuestion3", "set": ["Items = the choices, one per line"]},
      {"toolbox": "Button", "name": "btnCheck3", "set": ["Text = Check"]}],
     "done": "The first three sit inside pnlButtonsQuestion. The last four sit inside pnlListQuestion."}},
    {"p": "In the Toolbox, PictureBox makes a picture box. ComboBox makes a drop-down list."},
    {"p": "For Image, click the three dots beside it. Click Import, pick YOUR picture, then click OK."},
    {"p": "Items works as it did for the year group list in chapter 2."},
    {"watch": "Put the RIGHT answer first in the Items list. The code on screen 5-4 looks for it there."}
   ]},
   {"id": "4", "title": "Fill the question 4 and question 5 panels", "foot": "done",
    "goal": "Question 4 holds a group box with four round buttons and Check, and question 5 holds a label, a number box and Check.",
    "blocks": [
    {"p": "Question 4 has four answers. Only one can be picked. Question 5 is answered with a number."},
    {"box": {"title": "See it in Visual Studio", "fold": True, "blocks": [
      frames("F8", "Drag a group box, round buttons and a number box", [
        ("f8-1", "The Toolbox with GroupBox shown", "Drag a GroupBox into the question 4 panel."),
        ("f8-2", "Four RadioButtons dropped inside the group box", "Drag four RadioButtons INSIDE the group box."),
        ("f8-3", "A NumericUpDown dropped into the question 5 panel", "Drag a NumericUpDown into the question 5 panel.")])]}},
    {"controls": {"form": Q, "rows": [
      {"toolbox": "GroupBox", "name": "gbQuestion4", "set": ["Text = question 4"]},
      {"toolbox": "RadioButton", "name": "rbA", "set": ["Text = answer A"]},
      {"toolbox": "RadioButton", "name": "rbB", "set": ["Text = answer B"]},
      {"toolbox": "RadioButton", "name": "rbC", "set": ["Text = answer C"]},
      {"toolbox": "RadioButton", "name": "rbD", "set": ["Text = answer D"]},
      {"toolbox": "Button", "name": "btnCheck4", "set": ["Text = Check"]},
      {"toolbox": "Label", "name": "lblQuestion5", "set": ["Text = question 5"]},
      {"toolbox": "NumericUpDown", "name": "nudQuestion5", "set": []},
      {"toolbox": "Button", "name": "btnCheck5", "set": ["Text = Check"]}],
     "done": "The group box sits in pnlRadioQuestion, with the next five inside it. The last three sit inside pnlNumberQuestion."}},
    {"watch": "The four round buttons and btnCheck4 go INSIDE the group box. Then only one round button can be picked."}
   ]}]},
  {"id": "3", "title": "Getting to the quiz", "screens": [
   {"id": "1", "title": "Open the quiz from the Take quiz button", "foot": "done",
    "goal": "Pressing Take quiz closes the data entry form and opens a new quiz form.",
    "blocks": [
    {"p": "The Take quiz button is on the data entry form. It swaps that form for the quiz."},
    {"words": [
      ["this.Close()", "Close this form for good.", "3-1", True],
      ["new frmQuiz().Show()", "Make a new quiz form and show it.", "3-1", True],
      [".ToLower()", "Turn every letter into a small letter.", "4-1", True],
      ["BackColor", "The background colour of a control.", "4-1", True]],
     "intro": "Four new things in this chapter. Two are on this screen. Click one to see what it means."},
    {"drawn": {"id": "form-swap", "alt": "The data entry form fades away. The quiz form appears in its place.",
               "say": "The data entry form closes. The quiz form opens."}},
    {"steps": [step("3-1.1", "Open frmDataEntry in the Design tab. Double-click the Take quiz button.", "The code tab opens at btnTakeQuiz_Click.")]},
    code("3-1.c1", "The Take quiz button", "between the curly brackets of btnTakeQuiz_Click", D, "btnTakeQuiz_Click", 1, 6,
         [given(1, 2),
          [3, 5, "Close this form, open the quiz", "A note for you. The data entry form closes. A new quiz form opens."],
          given(6, 6)],
         ["frmQuiz"], ["frmQuiz"]),
    {"p": "[[this.Close()|0]] closes the data entry form. [[new frmQuiz().Show()|1]] makes the quiz and shows it."},
    {"watch": "The data entry form forgets everything when it closes. So its details are kept in Global.cs."}
   ]}]},
  {"id": "4", "title": "Question 1: a typed answer", "screens": [
   {"id": "1", "title": "Mark the typed answer to question 1 right or wrong", "foot": "done",
    "goal": "If the typed answer in small letters matches, the score goes up and the panel turns green, or else it turns red.",
    "blocks": [
    {"p": "Question 1 is typed in a box. Its Check button marks it."},
    {"p": "[[.ToLower()|2]] turns every letter small. So EMERGENCY and Emergency both match."},
    {"p": "[[BackColor|3]] is the background colour of a panel. Green means right. Red means wrong."},
    {"steps": [step("4-1.1", "Open frmQuiz in the Design tab. Double-click the Check button of question 1.", "The code tab opens at btnCheck1_Click.")]},
    code("4-1.c1", "Question 1's Check button, part 1 of 2", "between the curly brackets of btnCheck1_Click", Q, "btnCheck1_Click", 1, 12,
         [given(1, 2),
          [3, 8, "Right?", "Is the answer, in small letters, emergency? Then add 1, turn the panel green and show the score."],
          [9, 12, "Wrong", "Any other answer turns the panel red."]],
         ["tbxQuestion1", "Global.quizScore", "pnlTextQuestion", "lblResult"], ["tbxQuestion1"],
         yours="MY answer is emergency. Type YOUR answer, all in small letters.")
   ]},
   {"id": "2", "title": "Switch off question 1 and switch on question 2", "foot": "done",
    "goal": "After question 1 is marked, its panel switches off and the question 2 panel switches on.",
    "blocks": [
    {"p": "Right or wrong, the quiz moves on. Question 1 switches off. Question 2 switches on."},
    {"flow": {"form": Q, "lit": ["pnlTextQuestion"], "then": ["pnlButtonsQuestion"], "keep": False,
              "before": "Question 1 is marked.",
              "say": "The question 1 panel switches off. The question 2 panel switches on."}},
    code("4-2.c1", "Question 1's Check button, part 2 of 2", "under part 1, " + C1, Q, "btnCheck1_Click", 13, 16,
         [[13, 14, "Move to the next question", "Question 1 switches off. Question 2 switches on."],
          given(15, 16)],
         ["pnlTextQuestion", "pnlButtonsQuestion"], ["pnlButtonsQuestion"]),
    {"watch": "Type these two lines straight after the last line of part 1. They run for a right answer and a wrong one."}
   ]}]},
  {"id": "5", "title": "Questions 2 and 3", "screens": [
   {"id": "1", "title": "Score a point when the right button is pressed", "foot": "done",
    "goal": "The right answer button adds 1 to the score, turns the panel green and switches on question 3.",
    "blocks": [
    {"p": "Question 2 has two buttons. Each button has its own code. Only the right button adds a point."},
    {"steps": [step("5-1.1", "In the Design tab, double-click the right answer button of question 2.", "The code tab opens at btnCorrect_Click.")]},
    code("5-1.c1", "The right answer button", "between the curly brackets of btnCorrect_Click", Q, "btnCorrect_Click", 1, 9,
         [given(1, 2),
          [3, 5, "Add a point", "A note for you. Then 1 is added to the score, and the score is shown."],
          [6, 8, "Green, then move on", "The panel turns green. Question 2 switches off. Question 3 switches on."],
          given(9, 9)],
         ["Global.quizScore", "lblResult", "pnlButtonsQuestion", "pnlListQuestion"], ["pnlListQuestion"],
         yours="Which of YOUR two buttons is the right answer? Only that one scores.")
   ]},
   {"id": "2", "title": "Turn question 2 red when the wrong button is pressed", "foot": "done",
    "goal": "The wrong answer button turns the panel red, adds nothing, and still switches on question 3.",
    "blocks": [
    {"p": "The wrong button does the same, with two changes. It adds no point, and the panel turns red."},
    {"steps": [step("5-2.1", "In the Design tab, double-click the wrong answer button of question 2.", "The code tab opens at btnIncorrect_Click.")]},
    code("5-2.c1", "The wrong answer button", "between the curly brackets of btnIncorrect_Click", Q, "btnIncorrect_Click", 1, 7,
         [given(1, 2),
          [3, 6, "Red, then move on", "A note for you. The panel turns red. Question 2 switches off. Question 3 switches on."],
          given(7, 7)],
         ["pnlButtonsQuestion", "pnlListQuestion"], ["pnlButtonsQuestion"]),
    {"watch": "Each button has its own curly brackets. Type this code in btnIncorrect_Click, not in btnCorrect_Click."}
   ]},
   {"id": "3", "title": "Stop question 3 when nothing is chosen", "foot": "done",
    "goal": "If nothing is chosen in the question 3 list, a message asks the user to choose and nothing else happens.",
    "blocks": [
    {"p": "Question 3 is a drop-down list. A user could press Check with nothing chosen."},
    {"p": ".SelectedIndex == -1 asks if nothing is chosen. You met it in chapter 4."},
    {"steps": [step("5-3.1", "In the Design tab, double-click the Check button of question 3.", "The code tab opens at btnCheck3_Click.")]},
    code("5-3.c1", "Question 3's Check button, part 1 of 3", "between the curly brackets of btnCheck3_Click", Q, "btnCheck3_Click", 1, 7,
         [given(1, 2),
          [3, 7, "Nothing chosen?", "If nothing is chosen, a note for you, then a message asks the user to choose."]],
         ["cbxQuestion3"], ["cbxQuestion3"]),
    {"watch": "With nothing chosen, nothing else happens. The list stays switched on so the user can choose."}
   ]},
   {"id": "4", "title": "Score a point when the right item is chosen", "foot": "done",
    "goal": "If the first item in the list is chosen, the score goes up and the panel turns green.",
    "blocks": [
    {"p": "else runs when something is chosen. Then the code asks: is it the right item?"},
    {"p": "The items are counted from 0. So the first item is number 0."},
    code("5-4.c1", "Question 3's Check button, part 2 of 3", "under part 1, " + C3, Q, "btnCheck3_Click", 8, 16,
         [[8, 9, "Something is chosen", "else, then its curly bracket."],
          [10, 16, "Right?", "Is item 0 chosen? A note, then add 1, turn the panel green and show the score."]],
         ["cbxQuestion3", "Global.quizScore", "pnlListQuestion", "lblResult"], ["cbxQuestion3"],
         yours="MY right answer is the first item in the list, number 0. Count YOUR list from 0.")
   ]},
   {"id": "5", "title": "Turn question 3 red, then switch on question 4", "foot": "done",
    "goal": "Any other item turns the panel red, then question 3 switches off and question 4 switches on.",
    "blocks": [
    {"p": "Last, a wrong item turns the panel red. Then the quiz moves on to question 4."},
    code("5-5.c1", "Question 3's Check button, part 3 of 3", "under part 2, " + C3, Q, "btnCheck3_Click", 17, 26,
         [[17, 21, "Wrong", "Any other item. A note, then the panel turns red."],
          [22, 24, "Move to the next question", "A note. Question 3 switches off. Question 4 switches on."],
          given(25, 26)],
         ["pnlListQuestion", "pnlRadioQuestion"], ["pnlRadioQuestion"]),
    {"watch": "The two move-on lines sit inside the else of part 2. They never run when nothing is chosen."}
   ]}]},
  {"id": "6", "title": "Try your first three questions", "screens": [
   {"id": "1", "title": "Try every way through questions 1, 2 and 3", "foot": "chapter-done",
    "goal": "I open the quiz, answer in capitals, answer wrongly, try both kinds of button, and press Check with nothing chosen.",
    "blocks": [
    {"p": "Run your program and get to the Take quiz button. Then try each row."},
    {"check": [
     tryit("6-1.t1", "Press Take quiz.",
           "The data entry form closes. The quiz opens.", "Look at screen 3-1.", "#cw/06/3-1"),
     tryit("6-1.t2", "Type YOUR question 1 answer in capitals. Press Check.",
           "The panel goes green. The score shows 1.", "Look at part 1 on screen 4-1.", "#cw/06/4-1"),
     tryit("6-1.t3", "Run it again. Type a wrong answer for question 1. Press Check.",
           "The panel goes red. Question 2 can be clicked.", "Look at part 2 on screen 4-2.", "#cw/06/4-2"),
     tryit("6-1.t4", "Press the right button for question 2.",
           "The panel goes green and the score goes up by 1.", "Look at screen 5-1.", "#cw/06/5-1"),
     tryit("6-1.t5", "Choose nothing in the list and press Check.",
           "A message asks you to choose. The quiz must NOT move on to question 4.", "If it moved on, look at screen 5-3.", "#cw/06/5-3", neg=True)]}
   ]}]}
 ]}
