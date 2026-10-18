Q = 'frmQuiz'
ch7 = {
 "id": "07", "n": 7, "of": 15, "title": "The quiz: questions 4 and 5, and the score", "kind": "new", "color": "#0F9D8A", "noTurn": True,
 "one": "Make only question 1 work at the start, mark questions 4 and 5, and send the score back.",
 "prev": {"id": "06", "n": 6, "title": "The quiz: the first three questions"},
 "next": {"id": "08", "n": 8, "title": "The data entry form: its Load event"},
 "methods": [["frmQuiz", "frmQuiz_Load"], ["frmQuiz", "btnCheck4_Click"], ["frmQuiz", "btnCheck5_Click"], ["frmQuiz", "btnReturn_Click"]],
 "stages": [
  {"id": "1", "title": "Check your quiz has what it needs", "screens": [
   {"id": "1", "title": "Check your quiz has what it needs before you code the rest", "foot": "have",
    "goal": "Before I code the rest of the quiz, I check I have the question 4 and 5 panels, the Return button, question 3's code and the two things in Global.cs.",
    "blocks": [
    {"p": "A few things need to be done already before you can code the rest of the quiz. This screen checks them."},
    {"check": [
     have("1-1.t1", "Open frmQuiz in the Design tab. Does question 4 have a group box, four radio buttons and a Check button?",
          "In my example it is the panel on the right of the middle row. In yours, look for the panel with the radio buttons.", "Go to chapter 6, stage 2.", "#cw/06/2-1"),
     have("1-1.t2", "Does question 5 have a number box and a Check button?",
          "In my example it is the wide panel along the bottom. Yours may be somewhere else. Look for the number box.", "Go to chapter 6, stage 2.", "#cw/06/2-1"),
     have("1-1.t3", "Is there a Return button in the score panel?",
          "In my example it is near the bottom of the tall panel on the left. Yours is in your score panel.", "Go to chapter 6, stage 2.", "#cw/06/2-1"),
     have("1-1.t4", "Double-click question 3's Check button. Is there code between its two curly brackets?",
          "The code tab opens at the code behind that button. Lines between the curly brackets mean yes.", "Go to chapter 6, stage 5.", "#cw/06/5-1"),
     have("1-1.t5", "Open Global.cs. Are quizScore and quizTaken in it? quizScore counts the right answers. quizTaken remembers whether the quiz has been done.",
          "Solution Explorer is on the right. Double-click Global.cs to open it. Look for the two lines with those names.", "Go to chapter 3, stage 3.", "#cw/03/3-1")]},
    {"box": {"title": "Not sure where to look?", "fold": True,
             "text": "Solution Explorer is on the right of Visual Studio 2019. It lists every form. Double-click frmQuiz to see it in the Design tab. Right-click it and choose View Code to see its code."}}
   ]}]},
  {"id": "2", "title": "Make only question 1 work when the quiz opens", "screens": [
   {"id": "1", "title": "Meet the Load event: code that runs when the form opens", "foot": "next",
    "goal": "A Load event is code that runs by itself the moment the form opens, before anyone clicks anything.",
    "blocks": [
    {"p": "The quiz has a problem right now. When it opens, all five questions can be clicked, in any order."},
    {"p": "We want only question 1 to work at the start. For that we need code that runs the moment the form opens."},
    {"words": [
      ["Load event", "Code that runs by itself the moment the form opens, before anyone clicks anything.", "2-1", True],
      [".Checked", "Tells you if a radio button's dot is filled in. True if it is, false if it is not.", "3-1", True],
      ["return;", "Stop here. Nothing under this line runs.", "3-3", True],
      [".Value", "The number showing in a number box.", "4-1", True]],
     "intro": "Four new things in this chapter. Click any marked word to see what it means."},
    {"p": "That code is called a [[Load event|0]]. You have not met one yet. This is the first time you will use one."},
    {"drawn": {"id": "load-now", "alt": "The quiz form slides in. A code card lights up under it with the words runs now.",
               "say": "The quiz form opens. Its Load event runs straight away. Nobody has clicked anything."}},
    {"p": "Every form can have a Load event if you want one. The quiz needs one, so that is where you write your first."},
    {"watch": "A Load event is not a button. Nobody clicks it. It runs by itself when the form opens."}
   ]},
   {"id": "2", "title": "Make the Load event by double-clicking the form itself", "foot": "done",
    "goal": "To make a Load event I double-click the form itself, not a control on it, and Visual Studio writes frmQuiz_Load for me.",
    "blocks": [
    {"p": "Visual Studio makes the Load event for you. All you do is double-click the form itself."},
    {"steps": [
     step("2-2.1", "Open frmQuiz in the Design tab.",
          "You can see the quiz form with its panels.", cap("f4-1", "The quiz form open in the Design tab")),
     step("2-2.2", "Double-click the form itself. The title bar at the top of the form is the safest spot.",
          "The code tab opens. Visual Studio has written frmQuiz_Load for you, with two curly brackets.", cap("f4-2", "The pointer on the title bar of the quiz form in the Design tab"),
          [["I got a panel's code or a button's code instead.", "You double-clicked a control, not the form. Go back to the Design tab and double-click the form's title bar."]]),
     step("2-2.3", "Look where your cursor is blinking.",
          "It is between the two curly brackets of frmQuiz_Load. That is where your code goes.", cap("f4-3", "The code tab with the new empty frmQuiz_Load and the cursor between its curly brackets"))]},
    {"watch": "Double-click the FORM, not a panel or a button. Double-clicking a button gives you that button's code instead."}
   ]},
   {"id": "3", "title": "Only question 1 can be clicked when the quiz opens", "foot": "next",
    "goal": "When the quiz opens, question 1 works and questions 2 to 5 are switched off and grey, so they get answered in order.",
    "blocks": [
    {"p": "Here is what we want the quiz to look like the moment it opens."},
    {"flow": {"form": "frmQuiz", "lit": ["pnlQuizScore", "pnlTextQuestion"], "then": [],
              "say": "Question 1 is switched on. Questions 2, 3, 4 and 5 are switched off and grey. The score panel is on."}},
    {"p": "Each question sits in its own panel. A switched-off panel goes grey, and nothing in it can be clicked."},
    {"p": "So the Load event has one job. Switch off the four panels for questions 2, 3, 4 and 5."},
    {"p": "Later, when a question is answered, its panel switches off and the next one switches on. You code that in stages 3 and 4."},
    {"watch": "Count them: four panels to switch off. The Return button gets hidden too, until the quiz is over."}
   ]},
   {"id": "4", "title": "Type the code that switches off questions 2 to 5", "foot": "done",
    "goal": "In frmQuiz_Load I set Enabled to false on the four panels and Visible to false on the Return button.",
    "blocks": [
    {"p": "Now you type the Load event's code: four panels switched off and one button hidden."},
    code("2-4.c1", "The quiz's Load event", "between the curly brackets of frmQuiz_Load, in frmQuiz.cs", Q, "frmQuiz_Load", 1, 9,
         [given(1, 2),
          [3, 7, "Switch off questions 2 to 5", "The line that starts with two slashes is a note for you. The computer skips it. Then one line per panel. Enabled = false switches the panel off and turns it grey."],
          [8, 8, "Hide the Return button", "Visible = false hides the button. Stage 4 brings it back after question 5."],
          given(9, 9)],
         ["pnlButtonsQuestion", "pnlListQuestion", "pnlRadioQuestion", "pnlNumberQuestion", "btnReturn"],
         ["pnlButtonsQuestion", "pnlListQuestion", "pnlRadioQuestion", "pnlNumberQuestion", "btnReturn"]),
    {"box": {"title": "See the real IntelliSense list", "fold": True, "blocks": [
      frames("F3", "IntelliSense in Visual Studio 2019", [
        ("f3-1", "The code tab with pnl typed on a new line", "Type the first letters of the name."),
        ("f3-2", "The IntelliSense list open under pnl, showing the six panel names", "The list pops up with every matching name in YOUR program."),
        ("f3-3", "The line completed to pnlButtonsQuestion", "Press Tab. The name is typed for you, spelt right.")])]}},
    {"watch": "Four panels get Enabled = false. The Return button gets Visible = false, which hides it."}
   ]}]},
  {"id": "3", "title": "Mark question 4, the one with radio buttons", "screens": [
   {"id": "1", "title": "How your code can tell which radio button is chosen", "foot": "next",
    "goal": "rbB.Checked is true when B's dot is filled in, and an exclamation mark in front means NOT.",
    "blocks": [
    {"p": "Question 4 has four radio buttons. Only one can have its dot filled in."},
    {"p": "Your code needs to know which one. Every radio button has [[.Checked|1]]. It is true when the dot is filled in."},
    {"code": {"id": "3-1.r1", "kind": "read", "snippet": True, "title": "Two ways to ask a radio button", "lang": "cs",
              "text": "rbB.Checked\n!rbA.Checked",
              "partLines": [[1, 1, "Is B chosen?", "True when the dot of rbB is filled in."],
                            [2, 2, "Is A NOT chosen?", "The exclamation mark means NOT. True when the dot of rbA is empty."]],
              "names": ["rbA", "rbB"], "isense": []}},
    {"p": "In my example the radio buttons are called rbA, rbB, rbC and rbD. Yours have the names you gave them."},
    {"watch": "An exclamation mark in front means NOT. Read !rbA.Checked as: A is not chosen."}
   ]},
   {"id": "2", "title": "Open the code behind question 4's Check button", "foot": "done",
    "goal": "Double-clicking a button in the Design tab opens the code behind that button.",
    "blocks": [
    {"p": "Everything question 4 does happens when its Check button is clicked. So the code goes behind that button."},
    frames("F1", "Opening the code behind a button", [
      ("f1-1", "The quiz form in the Design tab, with the pointer on question 4's Check button", "In the Design tab, double-click the button."),
      ("f1-2", "The code tab with a new empty btnCheck4_Click", "The code tab opens. Visual Studio writes the first and last lines for you, with nothing in between.")]),
    {"steps": [step("3-2.1", "In the Design tab of frmQuiz, double-click question 4's Check button.",
                    "The code tab opens at btnCheck4_Click. It is empty between the curly brackets.")]},
    {"watch": "Double-click the button itself, not the panel around it. The panel would give you code you do not want."}
   ]},
   {"id": "3", "title": "Stop if no radio button has been chosen", "foot": "done",
    "goal": "If none of the four dots is filled in, show a message and use return to stop, so nothing else runs.",
    "blocks": [
    {"p": "What if the pupil clicks Check without choosing an answer? We should not mark an empty answer."},
    {"p": "So the first thing the Check button does is look at all four dots. If none is filled in, it shows a message and stops."},
    code("3-3.c1", "Question 4's Check button, part 1 of 3", "between the curly brackets of btnCheck4_Click, in frmQuiz.cs", Q, "btnCheck4_Click", 1, 8,
         [given(1, 2),
          [3, 8, "No dot filled in? Show a message and stop", "The if line asks: are all four dots empty? If they are, a message pops up. Then return stops the code here."]],
         ["rbA", "rbB", "rbC", "rbD"], ["rbA"]),
    {"p": "[[return;|2]] means stop here. When nothing is chosen, nothing under that line runs."},
    {"drawn": {"id": "stop-sign", "alt": "A stop sign drops onto the return line of the code.",
               "say": "The stop sign lands on return. Nothing under this line runs."}},
    {"watch": "Each && means AND. All four dots must be empty for the message to show."}
   ]},
   {"id": "4", "title": "Add 1 to the score if the answer is right", "foot": "done",
    "goal": "If the right radio button is chosen the score goes up by 1 and the group box turns green, otherwise it turns red.",
    "blocks": [
    {"p": "Now the real marking. If the right dot is filled in, the score goes up by 1. If not, the box turns red."},
    code("3-4.c1", "Question 4's Check button, part 2 of 3", "between the curly brackets of btnCheck4_Click, in frmQuiz.cs", Q, "btnCheck4_Click", 9, 19,
         [[9, 15, "Right answer: score up by 1, box goes green", "If rbB is chosen, 1 is added to Global.quizScore. The label shows the new score. The group box turns green."],
          [16, 19, "Wrong answer: box goes red", "Any other dot turns the group box red. The score stays as it was."]],
         ["rbB", "Global.quizScore", "lblResult", "gbQuestion4"], ["lblResult", "gbQuestion4"],
         yours="In my example the right answer is the second radio button, rbB. Look at YOUR question 4. Which of YOUR radio buttons is the right answer? Use that one's name."),
    {"watch": "Type this after the } that closes the first if, not inside it."}
   ]},
   {"id": "5", "title": "Switch off question 4 and switch on question 5", "foot": "next",
    "goal": "After marking, question 4's panel is switched off and question 5's panel is switched on, whatever the answer was.",
    "blocks": [
    {"p": "Question 4 is marked, so it should not be answered again. And question 5 should wake up now."},
    code("3-5.c1", "Question 4's Check button, part 3 of 3", "between the curly brackets of btnCheck4_Click, in frmQuiz.cs", Q, "btnCheck4_Click", 20, 23,
         [[20, 22, "Switch off question 4, switch on question 5", "Question 4's panel gets Enabled = false and goes grey. Question 5's panel gets Enabled = true and wakes up."],
          given(23, 23)],
         ["pnlRadioQuestion", "pnlNumberQuestion"], ["pnlNumberQuestion"]),
    {"watch": "Type these lines after the } that closes the else, but before the last }. They run whether the answer was right or wrong."}
   ]},
   {"id": "6", "title": "Run it and watch question 5 switch on", "foot": "done",
    "goal": "When I check question 4, its panel goes grey and question 5's panel wakes up.",
    "blocks": [
    {"p": "Time to see it work. Question 4 goes grey, and question 5 wakes up."},
    {"flow": {"form": "frmQuiz", "lit": ["pnlQuizScore", "pnlRadioQuestion"], "then": ["pnlNumberQuestion"],
      "before": "Question 4 is switched on. Watch what happens when the answer is right.",
              "say": "Question 4 switches off. Question 5 switches on."}},
    {"steps": [step("3-6.1", "Click the green Start arrow at the top. Log in, go to the quiz and play through to question 4.",
                    "After Check, question 4 goes grey and question 5 is awake.", None,
                    [["Red errors appeared instead.", "The Error List at the bottom names the line. Double-click the error to jump to it."]])]}
   ]}]},
  {"id": "4", "title": "Mark question 5, the one with the number box", "screens": [
   {"id": "1", "title": "Add 1 to the score if the number is right", "foot": "done",
    "goal": "nudQuestion5.Value is the number showing, and if it equals the right answer the score goes up by 1.",
    "blocks": [
    {"p": "Question 5 uses a number box. The pupil clicks the little arrows to pick a number."},
    {"p": "Your code reads that number with [[.Value|3]]. Then it checks: is it the right answer?"},
    {"steps": [step("4-1.1", "In the Design tab, double-click question 5's Check button.", "The code tab opens at btnCheck5_Click, empty between the curly brackets.")]},
    code("4-1.c1", "Question 5's Check button, part 1 of 2", "between the curly brackets of btnCheck5_Click, in frmQuiz.cs", Q, "btnCheck5_Click", 1, 14,
         [given(1, 2),
          [3, 9, "Right number: score up by 1, panel goes green", "If the box shows 8, 1 is added to the score. The label shows it. The panel turns green."],
          [10, 14, "Wrong number: panel goes red", "Any other number turns the panel red."]],
         ["nudQuestion5", "Global.quizScore", "lblResult", "pnlNumberQuestion"], ["nudQuestion5"],
         yours="In my example the right number is 8. YOUR question 5 has its own right answer. Use YOUR number."),
    {"watch": "Two equals signs ask a question: is it the same as 8? One equals sign would try to change it."}
   ]},
   {"id": "2", "title": "Switch off question 5 and show the Return button", "foot": "done",
    "goal": "After question 5 is marked, its panel is switched off and the Return button is made visible.",
    "blocks": [
    {"p": "Question 5 is the last one. After it is marked, the quiz is over and the Return button can appear."},
    code("4-2.c1", "Question 5's Check button, part 2 of 2", "between the curly brackets of btnCheck5_Click, in frmQuiz.cs", Q, "btnCheck5_Click", 15, 18,
         [[15, 17, "Switch off question 5, show the Return button", "Question 5's panel gets Enabled = false. The Return button gets Visible = true and appears."],
          given(18, 18)],
         ["pnlNumberQuestion", "btnReturn"], ["btnReturn"]),
    {"watch": "Visible = true brings the button back. The Load event hid it with Visible = false."}
   ]},
   {"id": "3", "title": "Play the whole quiz", "foot": "done",
    "goal": "When I play the quiz, the questions open in order and the Return button appears after question 5.",
    "blocks": [
    {"p": "Play your quiz from the start and watch the panels wake up one after another."},
    frames("F14", "The running quiz", [
      ("f14-1", "The running quiz just opened: question 1 on, four grey panels, no Return button", "The quiz opens. Only question 1 is switched on. There is no Return button."),
      ("f14-2", "The running quiz with question 1 marked and grey, question 2 on", "Question 1 is marked and grey. Question 2 is switched on. The rest are still grey."),
      ("f14-3", "The running quiz with all five marked, the score showing and the Return button visible", "All five are marked. The Return button has appeared in the score panel.")]),
    {"steps": [step("4-3.1", "Click the green Start arrow. Play the quiz through to question 5.",
                    "After question 5's Check, the Return button appears in the score panel.")]},
    {"watch": "No Return button after question 5? Look at the Load event and at question 5's Check button."}
   ]}]},
  {"id": "5", "title": "Send the score back to the data entry form", "screens": [
   {"id": "1", "title": "Code the Return button", "foot": "done",
    "goal": "The Return button sets quizTaken to true in Global.cs, closes the quiz and opens a new data entry form.",
    "blocks": [
    {"p": "The Return button takes the pupil back to the data entry form. But first it needs to leave a note."},
    {"p": "When a form closes, it forgets everything. Global.cs does not forget. It remembers things for the whole program."},
    {"p": "Global.quizTaken is one thing in Global.cs. It is false until the quiz is taken. The Return button sets it to true."},
    {"steps": [step("5-1.1", "In the Design tab, double-click the Return button in the score panel.", "The code tab opens at btnReturn_Click, empty between the curly brackets.")]},
    code("5-1.c1", "The Return button", "between the curly brackets of btnReturn_Click, in frmQuiz.cs", Q, "btnReturn_Click", 1, 7,
         [given(1, 2),
          [3, 6, "Leave the note, close, go back", "Global.quizTaken becomes true. this.Close() closes the quiz form. The last line makes a new data entry form and shows it."],
          given(7, 7)],
         ["Global.quizTaken", "frmDataEntry"], ["Global.quizTaken"]),
    {"watch": "The order matters. Leave the note first, then close, then open the data entry form."}
   ]},
   {"id": "2", "title": "Why the data entry form still says Quiz not taken", "foot": "next",
    "goal": "After Return, the data entry form comes back fresh and has not read Global.cs yet, and chapter 8 fixes that.",
    "blocks": [
    {"p": "Press Return and the data entry form comes back. Its quiz panel still says Quiz not taken yet. The name boxes are empty."},
    {"p": "That is fine. Nothing is broken. The note is in Global.cs. The data entry form has not read it yet."},
    {"drawn": {"id": "fresh-screen", "alt": "The fresh data entry form on the left, Global.cs on the right with quizTaken set to true.",
               "say": "The fresh data entry form on the left. Global.cs on the right, with quizTaken set to true."}},
    {"p": "In chapter 8 you give the data entry form its own Load event, so it reads the note when it opens."},
    {"watch": "Do not try to fix this now. Chapter 8 is where it gets fixed."}
   ]}]},
  {"id": "6", "title": "Test the whole quiz", "screens": [
   {"id": "1", "title": "Test the whole quiz", "foot": "chapter-done",
    "goal": "I run the program and check each of the six things the quiz must do.",
    "blocks": [
    {"p": "Run your program and try each row. Tick the rows that work. A row that fails tells you where to look."},
    {"check": [
     tryit("6-1.t1", "Log in, type the details, work out the average, press Take Quiz.",
           "Only question 1 can be clicked. The other four are grey.", "Look at the Load event on screen 2-4.", "#cw/07/2-4"),
     tryit("6-1.t2", "Answer questions 1 to 3. Then press question 4's Check with no dot filled in.",
           "A message appears. Question 4 stays switched on.", "Look at the stop part on screen 3-3.", "#cw/07/3-3"),
     tryit("6-1.t3", "Choose the right radio button and press Check.",
           "The group box turns green and the score goes up by 1.", "Look at the marking on screen 3-4.", "#cw/07/3-4"),
     tryit("6-1.t4", "Set the right number on question 5 and press Check.",
           "The panel turns green and the Return button appears.", "Look at screens 4-1 and 4-2.", "#cw/07/4-1"),
     tryit("6-1.t5", "Press Return.",
           "The quiz closes and the data entry form comes back.", "Look at the Return button on screen 5-1.", "#cw/07/5-1"),
     tryit("6-1.t6", "Start the quiz again. Press question 5's Check before question 4 is answered.",
           "Nothing happens, because question 5's panel is grey.", "Look at the Load event on screen 2-4.", "#cw/07/2-4", neg=True)]}
   ]}]}
 ]}
