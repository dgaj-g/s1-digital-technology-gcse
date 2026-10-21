# Chapter 8, the data entry form's Load event (DESIGN_SPEC §9 ch08, voice §7a). Run by tools/build_content.py with its helpers.
D = 'frmDataEntry'
M = 'frmDataEntry_Load'
IN = "inside frmDataEntry_Load"
CH = {
 "id": "08", "n": 8, "of": 15, "title": "The data entry form: its Load event", "kind": "new", "color": "#E07A1F",
 "one": "When the form opens, read Global.cs and switch on the right panel.",
 "prev": {"id": "07", "n": 7, "title": "The quiz: questions 4 and 5, and the score"},
 "next": {"id": "09", "n": 9, "title": "The reaction test"},
 "methods": [[D, M]],
 "stages": [
  {"id": "1", "title": "Check what you need first", "thing": "the parts this chapter needs", "verb": "checking", "screens": [
   {"id": "1", "title": "Check the parts this chapter needs", "foot": "have", "done": "every row is ticked, or you have gone where its link says",
    "goal": "Before I start, I check the Enter button, the average button, the quiz Return button and three lines in Global.cs.",
    "blocks": [
    {"p": "This chapter uses work from earlier chapters, so this screen checks that it is there."},
    {"check": [
     have("1-1.t1", "Does your Enter button have its code from chapter 4?",
          "Double-click the Enter button in the Design tab. Look between its curly brackets.", "Go to chapter 4.", "#cw/04/1-1"),
     have("1-1.t2", "Does your average button have its code from chapter 5?",
          "Double-click the average button in the Design tab.", "Go to chapter 5.", "#cw/05/1-1"),
     have("1-1.t3", "Does the Return button on the quiz set Global.quizTaken to true?",
          "Open frmQuiz. Double-click the Return button. Look for quizTaken.", "Go to chapter 7, part 5.", "#cw/07/5-1"),
     have("1-1.t4", "Does Global.cs have quizTaken, averageCalculated and reactionTestTaken?",
          "Double-click Global.cs in Solution Explorer.", "Go to chapter 3, part 3.", "#cw/03/3-1")]}
   ]}]},
  {"id": "2", "title": "The problem and the plan", "thing": "the Load event", "verb": "making", "screens": [
   opener("Make a Load event for the data entry form", "This part explains why the data entry form must read Global.cs as it opens. Then it makes the Load event.",
           "A Load event is code that runs by itself the moment a form opens. You made one for the quiz in chapter 7.",
           "When it works, the code tab is open at frmDataEntry_Load. Its curly brackets are still empty."),
   {"id": "1", "title": "Why the form must read Global.cs as it opens", "foot": "next", "done": "you have read the picture and the lines under it",
    "goal": "Each time the data entry form opens it is brand new and empty, but Global.cs still holds everything.",
    "blocks": [
    {"p": "Take quiz closes the data entry form, and the quiz's Return button opens a new one."},
    {"drawn": {"id": "fresh-screen", "alt": "A brand new empty data entry form on the left. Global.cs on the right still holds the quiz score.",
               "say": "The new data entry form is empty. Global.cs still holds everything."}},
    {"p": "Every time the data entry form opens, it is brand new and empty. Global.cs still has it all, so the form must ask Global.cs the moment it opens."},
    {"p": "Code that runs the moment a form opens is a Load event. You met one in chapter 7."}
   ]},
   {"id": "2", "title": "Plan the Load event and make it", "foot": "done", "done": "the code tab is open at frmDataEntry_Load with your cursor between its curly brackets",
    "goal": "The Load event switches every panel off, asks Global.cs three questions, then fills the boxes and switches on the right panel.",
    "blocks": [
    {"p": "The Load event does three jobs, in this order."},
    {"p": "First, it switches all five panels off. Second, it asks Global.cs three questions."},
    {"p": "Third, from the answers, it fills the boxes and switches on the right panel."},
    {"steps": [
     step("2-2.1", "In Solution Explorer, double-click frmDataEntry. It opens in the Design tab.",
          "You can see the data entry form with its panels."),
     step("2-2.2", "Double-click the form's title bar at the top of the form.",
          "The code tab opens. Visual Studio has written frmDataEntry_Load for you.",
          None, [["I got a panel's code or a button's code instead.", "You double-clicked a control, not the form. Go back and double-click the form's title bar."]])]},
    {"watch": "Double-click the title bar, not a panel. A panel gives you the wrong code."}
   ]}]},
  {"id": "3", "title": "Switch everything off first", "thing": "the switch-off lines", "verb": "making", "screens": [
   opener("Switch every panel off as the form opens", "This part types the first lines of the Load event. They switch all five panels off.",
           "Every panel starts switched off. The next part switches on only the right one.",
           "When it works, the five switch-off lines are typed. Nothing on the form can be clicked yet."),
   {"id": "1", "title": "See every panel switched off", "foot": "done", "done": "you have looked at the picture and read the line under it",
    "goal": "I see all five panels switched off, which is how the form starts.",
    "blocks": [
    {"p": "The Load event starts by switching every panel off, as this picture shows."},
    {"flow": {"watch": "Count the five grey panels, none of them switched on", "labels": DL, "form": D, "lit": [], "then": [],
              "say": "All five panels are switched off. Nothing can be clicked yet."}},
   ]},
   {"id": "2", "title": "Switch off all five panels", "foot": "done", "done": "lines 3 to 8 are typed and the code has no red squiggles",
    "goal": "The first lines of the Load event switch off all five panels on the data entry form.",
    "blocks": [
    {"p": "A note, then five lines switch off each of the five panels in turn."},
    code("3-1.c1", "The Load event: code 1 of 6", "between the curly brackets of frmDataEntry_Load", D, M, 1, 9,
         [given(1, 2),
          [3, 9, "Switch off all five panels", "A note for you. Then each of the five panels is switched off."]],
         ["pnlReactionTest", "pnlPupilDetails", "pnlQuizResult", "pnlSwimmingGroup", "pnlSwimLengths"], ["pnlReactionTest"]),
    {"watch": "Start with every panel off. The next screens switch on the right one."}
   ]}]},
  {"id": "4", "title": "Three questions for Global.cs", "thing": "the three questions for Global.cs", "verb": "making", "screens": [
   opener("Ask Global.cs three questions and switch on the right panel", "This part asks Global.cs three questions: quiz taken, average worked out, test taken. Each yes fills boxes and switches on a panel.",
           "The first question has an else for a brand new pupil. The other two have no else.",
           "When it works, the form shows the details and scores a pupil already has. Only the right panel can be clicked."),
   {"id": "1", "title": "Show the score when the quiz has been taken", "foot": "done", "done": "lines 10 to 16 are typed and the code has no red squiggles",
    "goal": "If the quiz has been taken, the score shows in black, Take quiz is hidden and the reaction test panel switches on.",
    "blocks": [
    {"p": "Question 1 for Global.cs: has the quiz been taken, and if so, show the score."},
    {"words": [
      ["ForeColor", "The colour of the writing on a control.", "4-1", True],
      ["Visible = false", "Hide it. It is still there, but nobody can see it.", "4-1", True]],
     "intro": "Two new things in this chapter. Click any marked word to see what it means."},
    {"p": "[[ForeColor|0]] is the colour of the writing. [[Visible = false|1]] hides the Take quiz button."},
    code("4-1.c1", "The Load event: code 2 of 6", "under code 1, " + IN, D, M, 10, 17,
         [[10, 12, "Has the quiz been taken?", "If quizTaken is true, a note for you, then the yes lines run."],
          [13, 17, "Yes: show the score and move on", "Black writing, the score turned into words by .ToString(), Take quiz hidden, the reaction test on."]],
         ["Global.quizTaken", "lblQuizStatus", "Global.quizScore", "btnTakeQuiz", "pnlReactionTest"], ["lblQuizStatus"]),
    {"watch": "The curly bracket of the if stays open here. Code 3 closes it."}
   ]},
   {"id": "2", "title": "Put the pupil's details back in their boxes", "foot": "done", "done": "lines 18 to 26 are typed and the code has no red squiggles",
    "goal": "When the quiz has been taken, the surname, first name, gender and year group go back from Global.cs into their boxes.",
    "blocks": [
    {"p": "Still inside the yes part, the pupil's details come back from Global.cs into their boxes."},
    code("4-2.c1", "The Load event: code 3 of 6", "under code 2, " + IN, D, M, 18, 26,
         [[18, 22, "Put the details back", "A note, then each box gets its detail back from Global.cs."],
          [23, 26, "The end of the yes part", "Three empty lines, then the curly bracket that ends the yes part."]],
         ["tbxSurname", "Global.surname", "tbxFirstName", "Global.firstname", "cbxGender", "Global.gender", "cbxYeargroup", "Global.yearGroup"], ["Global.surname"]),
    {"watch": "These four lines are the Enter button's lines, the other way round. The box is on the left now."}
   ]},
   {"id": "3", "title": "See the details panel switch on for a new pupil", "foot": "done", "done": "you have looked at the picture and read the line under it",
    "goal": "I see only the details panel switch on, for a pupil who has not taken the quiz.",
    "blocks": [
    {"p": "else means otherwise, and here it runs when the quiz has not been taken yet."},
    {"flow": {"watch": "Watch only the details panel switch on", "labels": DL, "form": D, "lit": [], "then": ["pnlPupilDetails"],
              "say": "Only the details panel switches on. The other four stay switched off."}},
   ]},
   {"id": "4", "title": "Switch on only the details panel", "foot": "done", "done": "lines 27 to 34 are typed and the code has no red squiggles",
    "goal": "If the quiz is not taken, the details panel switches on and the quiz status says Quiz not taken yet in red.",
    "blocks": [
    {"p": "These lines switch on the details panel and show Quiz not taken yet in red."},
    code("4-3.c1", "The Load event: code 4 of 6", "under code 3, " + IN, D, M, 27, 35,
         [[27, 29, "No: a new pupil", "else, then a note for you."],
          [30, 35, "Switch on the details", "The details panel switches on. Red writing says Quiz not taken yet. Take quiz shows."]],
         ["pnlPupilDetails", "lblQuizStatus", "btnTakeQuiz"], ["pnlPupilDetails"])
   ]},
   {"id": "5", "title": "Show the attempts when the average is worked out", "foot": "done", "done": "lines 36 to 44 are typed and the code has no red squiggles",
    "goal": "If the average is worked out, the three attempts and the average go back in their boxes and the average button hides.",
    "blocks": [
    {"p": "Question 2 for Global.cs: is the average worked out, and if so, put the numbers back."},
    {"p": "The numbers are kept as numbers. .ToString() turns each one into words for its box."},
    code("4-4.c1", "The Load event: code 5 of 6", "under code 4, " + IN, D, M, 36, 45,
         [[36, 37, "Is the average worked out?", "If averageCalculated is true, the yes lines run."],
          [38, 41, "Put the numbers back", "The three attempts and the average go back in their boxes."],
          [42, 45, "Hide the button, keep it switched off", "The average button hides. The attempts panel stays switched off."]],
         ["Global.averageCalculated", "tbxAttempt1", "Global.attempt1", "tbxAttempt2", "Global.attempt2", "tbxAttempt3", "Global.attempt3", "tbxCalculateAverage", "Global.average", "btnCalculateAverage", "pnlSwimLengths"], ["tbxAttempt1"]),
    {"watch": "This question has no else. If the average is not worked out, nothing happens here."}
   ]},
   {"id": "6", "title": "See the group panel switch on after the test", "foot": "done", "done": "you have looked at the picture and read the line under it",
    "goal": "I see the test panel switch off and the group panel switch on.",
    "blocks": [
    {"p": "Question 3 for Global.cs: has the reaction test been taken?"},
    {"flow": {"watch": "Watch the test panel go grey as the group panel wakes up", "labels": DL, "form": D, "lit": ["pnlReactionTest"], "then": ["pnlSwimmingGroup"], "keep": False,
              "say": "The test panel switches off. The group panel switches on."}},
   ]},
   {"id": "7", "title": "Switch on the group panel when the test is taken", "foot": "done", "done": "lines 46 to 52 are typed and the code has no red squiggles",
    "goal": "If the reaction test is taken, its score shows, Take test hides, its panel switches off and the group panel switches on.",
    "blocks": [
    {"p": "These lines show the test score, hide Take test and switch the panels over."},
    code("4-5.c1", "The Load event: code 6 of 6", "under code 5, " + IN, D, M, 46, 54,
         [[46, 52, "Question 3: is the test taken?", "If yes, the score shows and the group panel switches on. A red line under btnTakeTest is fine. Chapter 9 makes it."],
          given(53, 54)],
         ["Global.reactionTestTaken", "lblTestStatus", "Global.reactionTestScore", "btnTakeTest", "pnlReactionTest", "pnlSwimmingGroup"], ["lblTestStatus"])
   ]}]},
  {"id": "5", "title": "Try your Load event", "thing": "your Load event", "verb": "testing", "screens": [
   {"id": "1", "title": "Try the data entry form before and after the quiz", "foot": "chapter-done", "done": "every row is ticked, or you have gone where its link says",
    "goal": "I run the program and check that only the details panel works at first, and that the quiz brings the details back.",
    "blocks": [
    {"p": "Run your program and log in, then try each row."},
    {"check": [
     tryit("5-1.t1", "Look at the data entry form as it opens.",
           "Only the details panel can be clicked. The quiz status says Quiz not taken yet in red.", "Look at the code on screen 4-4.", "#cw/08/4-4"),
     tryit("5-1.t2", "Fill in the details. Click the Enter button. Take the quiz. Click its Return button.",
           "The details are back in their boxes. The score shows in black.", "Look at the code on screens 4-1 and 4-2.", "#cw/08/4-1"),
     tryit("5-1.t3", "After the quiz, try the reaction test panel.",
           "The reaction test panel can be clicked.", "Look at the code on screen 4-1.", "#cw/08/4-1"),
     tryit("5-1.t4", "After the quiz, look for the Take quiz button.",
           "It must NOT be there.", "If it is there, look at the code on screen 4-1.", "#cw/08/4-1", neg=True)]}
   ]}]}
 ]}
