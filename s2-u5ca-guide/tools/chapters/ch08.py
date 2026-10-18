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
  {"id": "1", "title": "Check what you need first", "screens": [
   {"id": "1", "title": "Check the parts this chapter needs", "foot": "have",
    "goal": "Before I start, I check the Enter button, the average button, the quiz Return button and three lines in Global.cs.",
    "blocks": [
    {"p": "This chapter uses work from earlier chapters. This screen checks that it is there."},
    {"check": [
     have("1-1.t1", "Does your Enter button have its code from chapter 4?",
          "Double-click the Enter button in the Design tab. Look between its curly brackets.", "Go to chapter 4.", "#cw/04/1-1"),
     have("1-1.t2", "Does your average button have its code from chapter 5?",
          "Double-click the average button in the Design tab.", "Go to chapter 5.", "#cw/05/1-1"),
     have("1-1.t3", "Does the Return button on the quiz set Global.quizTaken to true?",
          "Open frmQuiz. Double-click the Return button. Look for quizTaken.", "Go to chapter 7, stage 5.", "#cw/07/5-1"),
     have("1-1.t4", "Does Global.cs have quizTaken, averageCalculated and reactionTestTaken?",
          "Double-click Global.cs in Solution Explorer.", "Go to chapter 3, stage 3.", "#cw/03/3-1")]}
   ]}]},
  {"id": "2", "title": "The problem and the plan", "screens": [
   {"id": "1", "title": "Why the form must read Global.cs as it opens", "foot": "next",
    "goal": "Each time the data entry form opens it is brand new and empty, but Global.cs still holds everything.",
    "blocks": [
    {"p": "The Take quiz button closes the data entry form. The Return button on the quiz opens a new one."},
    {"drawn": {"id": "fresh-screen", "alt": "A brand new empty data entry form on the left. Global.cs on the right still holds the quiz score.",
               "say": "The new data entry form is empty. Global.cs still holds everything."}},
    {"p": "Every time the data entry form opens, it is brand new. Nothing typed before is in it."},
    {"p": "Global.cs still has it all. So the form must ask Global.cs, the moment it opens."},
    {"p": "Code that runs the moment a form opens is a Load event. You met one in chapter 7."}
   ]},
   {"id": "2", "title": "Plan the Load event and make it", "foot": "done",
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
  {"id": "3", "title": "Switch everything off first", "screens": [
   {"id": "1", "title": "Switch off all five panels", "foot": "done",
    "goal": "The first lines of the Load event switch off all five panels on the data entry form.",
    "blocks": [
    {"flow": {"form": D, "lit": [], "then": [],
              "say": "All five panels are switched off. Nothing can be clicked yet."}},
    code("3-1.c1", "The Load event, part 1 of 6", "between the curly brackets of frmDataEntry_Load", D, M, 1, 9,
         [given(1, 2),
          [3, 9, "Switch off all five panels", "A note for you. Then each of the five panels is switched off."]],
         ["pnlReactionTest", "pnlPupilDetails", "pnlQuizResult", "pnlSwimmingGroup", "pnlSwimLengths"], ["pnlReactionTest"]),
    {"watch": "Start with every panel off. The next screens switch on the right one."}
   ]}]},
  {"id": "4", "title": "Three questions for Global.cs", "screens": [
   {"id": "1", "title": "Show the score when the quiz has been taken", "foot": "done",
    "goal": "If the quiz has been taken, the score shows in black, Take quiz is hidden and the reaction test panel switches on.",
    "blocks": [
    {"p": "Question 1 for Global.cs: has the quiz been taken? If yes, show the score."},
    {"words": [
      ["ForeColor", "The colour of the writing on a control.", "4-1", True],
      ["Visible = false", "Hide it. It is still there, but nobody can see it.", "4-1", True]],
     "intro": "Two new things in this chapter. Click any marked word to see what it means."},
    {"p": "[[ForeColor|0]] is the colour of the writing. [[Visible = false|1]] hides the Take quiz button."},
    code("4-1.c1", "The Load event, part 2 of 6", "under part 1, " + IN, D, M, 10, 17,
         [[10, 12, "Has the quiz been taken?", "If quizTaken is true, a note for you, then the yes lines run."],
          [13, 17, "Yes: show the score and move on", "Black writing, the score turned into words by .ToString(), Take quiz hidden, the reaction test on."]],
         ["Global.quizTaken", "lblQuizStatus", "Global.quizScore", "btnTakeQuiz", "pnlReactionTest"], ["lblQuizStatus"]),
    {"watch": "The curly bracket of the if stays open here. Part 3 closes it."}
   ]},
   {"id": "2", "title": "Put the pupil's details back in their boxes", "foot": "done",
    "goal": "When the quiz has been taken, the surname, first name, gender and year group go back from Global.cs into their boxes.",
    "blocks": [
    {"p": "Still inside the yes part. The pupil's details come back from Global.cs into their boxes."},
    code("4-2.c1", "The Load event, part 3 of 6", "under part 2, " + IN, D, M, 18, 26,
         [[18, 22, "Put the details back", "A note, then each box gets its detail back from Global.cs."],
          [23, 26, "The end of the yes part", "Three empty lines, then the curly bracket that ends the yes part."]],
         ["tbxSurname", "Global.surname", "tbxFirstName", "Global.firstname", "cbxGender", "Global.gender", "cbxYeargroup", "Global.yearGroup"], ["Global.surname"]),
    {"watch": "These four lines are the Enter button's lines, the other way round. The box is on the left now."}
   ]},
   {"id": "3", "title": "Switch on the details panel when the quiz is not taken", "foot": "done",
    "goal": "If the quiz is not taken, the details panel switches on and the quiz status says Quiz not taken yet in red.",
    "blocks": [
    {"p": "else means otherwise. Here it runs when the quiz has not been taken yet."},
    {"flow": {"form": D, "lit": [], "then": ["pnlPupilDetails"],
              "say": "Only the details panel switches on. The other four stay switched off."}},
    code("4-3.c1", "The Load event, part 4 of 6", "under part 3, " + IN, D, M, 27, 35,
         [[27, 29, "No: a new pupil", "else, then a note for you."],
          [30, 35, "Switch on the details", "The details panel switches on. Red writing says Quiz not taken yet. Take quiz shows."]],
         ["pnlPupilDetails", "lblQuizStatus", "btnTakeQuiz"], ["pnlPupilDetails"])
   ]},
   {"id": "4", "title": "Show the attempts when the average is worked out", "foot": "done",
    "goal": "If the average is worked out, the three attempts and the average go back in their boxes and the average button hides.",
    "blocks": [
    {"p": "Question 2 for Global.cs: has the average been worked out? If yes, put the numbers back."},
    {"p": "The numbers are kept as numbers. .ToString() turns each one into words for its box."},
    code("4-4.c1", "The Load event, part 5 of 6", "under part 4, " + IN, D, M, 36, 45,
         [[36, 37, "Is the average worked out?", "If averageCalculated is true, the yes lines run."],
          [38, 41, "Put the numbers back", "The three attempts and the average go back in their boxes."],
          [42, 45, "Hide the button, keep it switched off", "The average button hides. The attempts panel stays switched off."]],
         ["Global.averageCalculated", "tbxAttempt1", "Global.attempt1", "tbxAttempt2", "Global.attempt2", "tbxAttempt3", "Global.attempt3", "tbxCalculateAverage", "Global.average", "btnCalculateAverage", "pnlSwimLengths"], ["tbxAttempt1"]),
    {"watch": "This question has no else. If the average is not worked out, nothing happens here."}
   ]},
   {"id": "5", "title": "Switch on the group panel when the test is taken", "foot": "done",
    "goal": "If the reaction test is taken, its score shows, Take test hides, its panel switches off and the group panel switches on.",
    "blocks": [
    {"flow": {"form": D, "lit": ["pnlReactionTest"], "then": ["pnlSwimmingGroup"], "keep": False,
              "say": "The test panel switches off. The group panel switches on."}},
    code("4-5.c1", "The Load event, part 6 of 6", "under part 5, " + IN, D, M, 46, 54,
         [[46, 52, "Question 3: is the test taken?", "If yes, the score shows and the group panel switches on. A red line under btnTakeTest is fine. Chapter 9 makes it."],
          given(53, 54)],
         ["Global.reactionTestTaken", "lblTestStatus", "Global.reactionTestScore", "btnTakeTest", "pnlReactionTest", "pnlSwimmingGroup"], ["lblTestStatus"])
   ]}]},
  {"id": "5", "title": "Try your Load event", "screens": [
   {"id": "1", "title": "Try the data entry form before and after the quiz", "foot": "chapter-done",
    "goal": "I run the program and check that only the details panel works at first, and that the quiz brings the details back.",
    "blocks": [
    {"p": "Run your program and log in. Then try each row."},
    {"check": [
     tryit("5-1.t1", "Look at the data entry form as it opens.",
           "Only the details panel can be clicked. The quiz status says Quiz not taken yet in red.", "Look at part 4 on screen 4-3.", "#cw/08/4-3"),
     tryit("5-1.t2", "Fill in the details. Click the Enter button. Take the quiz. Click its Return button.",
           "The details are back in their boxes. The score shows in black.", "Look at parts 2 and 3 on screens 4-1 and 4-2.", "#cw/08/4-1"),
     tryit("5-1.t3", "After the quiz, try the reaction test panel.",
           "The reaction test panel can be clicked.", "Look at part 2 on screen 4-1.", "#cw/08/4-1"),
     tryit("5-1.t4", "After the quiz, look for the Take quiz button.",
           "It must NOT be there.", "If it is there, look at part 2 on screen 4-1.", "#cw/08/4-1", neg=True)]}
   ]}]}
 ]}
