# Chapter 4, the Enter button (DESIGN_SPEC §9 ch04, voice §7a). Run by tools/build_content.py with its helpers.
D = 'frmDataEntry'
M = 'btnEnter_Click'
IN = "inside btnEnter_Click, in frmDataEntry.cs"
CH = {
 "id": "04", "n": 4, "of": 15, "title": "Pupil details: the Enter button", "kind": "expected", "color": "#1F77B4",
 "one": "Check the four boxes, keep them in Global.cs, switch off the panel.",
 "prev": {"id": "03", "n": 3, "title": "Global.cs: the file that remembers things between forms"},
 "next": {"id": "05", "n": 5, "title": "The average of three attempts"},
 "methods": [[D, M]],
 "stages": [
  {"id": "1", "title": "Check what your Enter button has", "screens": [
   {"id": "1", "title": "Check what your Enter button already does", "foot": "have",
    "goal": "I check that the Enter button has code, starts with string errors, lists what is missing, and switches the panels.",
    "blocks": [
    {"p": "Your Enter button may have some code already. This screen checks what is there."},
    {"check": [
     have("1-1.t1", "In the Design tab, double-click the Enter button. Is there code between its curly brackets?",
          "The code tab opens at btnEnter_Click. Lines between the curly brackets mean yes.", "Go to stage 2.", "#cw/04/2-1"),
     have("1-1.t2", "Does the first line inside it start with the words string errors?",
          "Look at the line straight after the first curly bracket.", "Go to stage 2.", "#cw/04/2-1"),
     have("1-1.t3", "Run it. Leave every box empty and press Enter. Does one message list what is missing?",
          "Use the green Start arrow. Log in first, then press Enter.", "Go to stage 3.", "#cw/04/3-1"),
     have("1-1.t4", "Fill in all four and press Enter. Does the details panel go grey and the attempts panel wake up?",
          "Grey means switched off. Its boxes cannot be clicked.", "Go to stage 3, screen 3.", "#cw/04/3-3")]}
   ]}]},
  {"id": "2", "title": "Collect every problem", "screens": [
   {"id": "1", "title": "Start an empty list of problems", "foot": "done",
    "goal": "The Enter button starts with an empty string called errors, so every problem found can be added to it.",
    "blocks": [
    {"p": "The Enter button checks four things. A pupil could get more than one of them wrong."},
    {"p": "So the code collects every problem first. Then it shows them all in one message."},
    {"words": [
      ["string.IsNullOrWhiteSpace", "Is this box empty, or only spaces?", "2-2", True],
      ["||", "Or. Only one side needs to be true.", "2-2", True],
      ["+=", "Add this on to the end.", "2-2", True],
      ["\\n", "Start a new line.", "2-2", True],
      [".SelectedIndex == -1", "Nothing is chosen in the drop-down list yet.", "2-3", True],
      ["Enabled = false", "Switch it off. It goes grey and cannot be clicked.", "3-2", True]],
     "intro": "Six new things in this chapter. Click any marked word to see what it means."},
    {"steps": [step("2-1.1", "In the Design tab, double-click the Enter button.", "The code tab opens at btnEnter_Click.")]},
    code("2-1.c1", "The Enter button, part 1 of 6", "between the curly brackets of btnEnter_Click, in frmDataEntry.cs", D, M, 1, 4,
         [given(1, 2),
          [3, 4, "An empty list of problems", "errors holds words. It starts with nothing in it. Each problem found is added to it."]],
         ["errors"], ["string"]),
    {"watch": "The errors line goes first. Every check below adds to it."}
   ]},
   {"id": "2", "title": "Add a problem when a name box is empty", "foot": "done",
    "goal": "If the surname box or the first name box is empty, a line saying so is added to errors.",
    "blocks": [
    {"p": "The first check asks: is either name box empty?"},
    {"p": "[[string.IsNullOrWhiteSpace|0]] asks if a box is empty or holds only spaces. [[|||1]] means or."},
    {"p": "[[+=|2]] adds a line on to the end of errors. [[\\n|3]] starts that line on a new line."},
    code("2-2.c1", "The Enter button, part 2 of 6", "under part 1, " + IN, D, M, 5, 9,
         [[5, 6, "Is a name box empty?", "Is the surname box empty, OR is the first name box empty?"],
          [7, 9, "Add the problem", "A note for you, then a new line is added to errors."]],
         ["tbxSurname", "tbxFirstName", "errors"], ["tbxSurname"]),
    {"watch": "Two straight lines make or. The key is next to Z on most keyboards. Hold Shift."}
   ]},
   {"id": "3", "title": "Add a problem when a name is too long or nothing is chosen", "foot": "done",
    "goal": "A name over 20 letters adds a too long line, and an empty drop-down list adds a must select line.",
    "blocks": [
    {"p": "Two more checks. Is a name too long? Is a drop-down list left with nothing chosen?"},
    {"p": "[[.SelectedIndex == -1|4]] asks if nothing is chosen. -1 means nothing is chosen yet."},
    code("2-3.c1", "The Enter button, part 3 of 6", "under part 2, " + IN, D, M, 10, 18,
         [[10, 13, "Too long?", "Is either name more than 20 letters? If so, add a line to errors."],
          [14, 18, "Nothing chosen?", "Is nothing chosen for year group OR gender? A note, then a line is added."]],
         ["tbxSurname", "tbxFirstName", "cbxYeargroup", "cbxGender", "errors"], ["cbxYeargroup"],
         yours="MY longest name is 20 letters. Use the number YOUR task sheet gives."),
    {"watch": "Leave the spelling mistakes in the notes. The computer skips notes."}
   ]}]},
  {"id": "3", "title": "Show the problems or keep the details", "screens": [
   {"id": "1", "title": "Show every problem in one message", "foot": "done",
    "goal": "If errors has anything in it, one message box shows every problem found.",
    "blocks": [
    {"p": "Now every check is done. If errors holds anything, there was a problem."},
    {"p": "errors.Length counts its characters. More than 0 means something was added."},
    code("3-1.c1", "The Enter button, part 4 of 6", "under part 3, " + IN, D, M, 19, 22,
         [[19, 22, "Any problems? Show them", "If errors is not empty, a message box shows every line in it."]],
         ["errors"], ["string"]),
    {"watch": "There is one message box, not three. It shows every problem at once."}
   ]},
   {"id": "2", "title": "Keep the four details in Global.cs", "foot": "done",
    "goal": "With no problems, the surname, first name, gender and year group each go into their line in Global.cs.",
    "blocks": [
    {"p": "else runs when errors is empty. That means every box was filled in right."},
    {"p": "So the four details are kept in Global.cs. That is the file you made in chapter 3. Every form can read it."},
    code("3-2.c1", "The Enter button, part 5 of 6", "under part 4, " + IN, D, M, 23, 29,
         [[23, 25, "No problems", "else, then a note for you."],
          [26, 29, "Keep the four details", "Each one goes into its line in Global.cs."]],
         ["Global.surname", "tbxSurname", "Global.firstname", "tbxFirstName", "Global.gender", "cbxGender", "Global.yearGroup", "cbxYeargroup"], ["Global.surname"]),
    {"watch": "else opens with a curly bracket here. Its closing curly bracket comes in part 6."}
   ]},
   {"id": "3", "title": "Switch off the details panel and switch on the attempts panel", "foot": "done",
    "goal": "After the details are kept, the attempts panel switches on and the details panel switches off.",
    "blocks": [
    {"p": "Last, the Enter button moves the pupil on. [[Enabled = false|5]] switches a panel off."},
    {"flow": {"form": D, "lit": ["pnlPupilDetails"], "then": ["pnlSwimLengths"], "keep": False,
              "before": "The details are filled in right. Enter is pressed.",
              "say": "The details panel goes grey and switches off. The attempts panel switches on."}},
    code("3-3.c1", "The Enter button, part 6 of 6", "under part 5, inside the else of btnEnter_Click", D, M, 30, 34,
         [[30, 31, "Move to the next panel", "The attempts panel switches on. The details panel switches off."],
          given(32, 34)],
         ["pnlSwimLengths", "pnlPupilDetails"], ["pnlSwimLengths"])
   ]}]},
  {"id": "4", "title": "Try your Enter button", "screens": [
   {"id": "1", "title": "Try every way through the Enter button", "foot": "chapter-done",
    "goal": "I run the program and try empty boxes, a long surname, all four filled in, and typing in the grey panel.",
    "blocks": [
    {"p": "Run your program and log in. Then try each row. A row that fails tells you where to look."},
    {"check": [
     tryit("4-1.t1", "Leave every box empty and press Enter.",
           "One message lists every missing thing, each on its own line.", "Look at parts 2 and 3 on screens 2-2 and 2-3.", "#cw/04/2-2"),
     tryit("4-1.t2", "Type a surname of 21 letters. Fill in the rest. Press Enter.",
           "The message says the name is too long.", "Look at part 3 on screen 2-3.", "#cw/04/2-3"),
     tryit("4-1.t3", "Fill in all four and press Enter.",
           "The details panel goes grey. The attempts panel can be clicked.", "Look at part 6 on screen 3-3.", "#cw/04/3-3"),
     tryit("4-1.t4", "After that, click in the surname box and try to type.",
           "You must NOT be able to type in it.", "If you can, look at part 6 on screen 3-3.", "#cw/04/3-3", neg=True)]}
   ]}]}
 ]}
