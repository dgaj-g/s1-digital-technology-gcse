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
  {"id": "1", "title": "Check what your Enter button has", "thing": "your Enter button so far", "verb": "checking", "screens": [
   {"id": "1", "title": "Check what your Enter button already does", "foot": "have", "done": "every row is ticked, or you have gone where its link says",
    "goal": "I check that the Enter button has code, starts with string errors, lists what is missing, and switches the panels.",
    "blocks": [
    {"p": "Your Enter button may already have some code, so this screen checks what is there."},
    {"check": [
     have("1-1.t1", "In the Design tab, double-click the Enter button. Is there code between its curly brackets?",
          "The code tab opens at btnEnter_Click. Lines between the curly brackets mean yes.", "Go to part 2.", "#cw/04/2-1"),
     have("1-1.t2", "Does the first line inside it start with the words string errors?",
          "Look at the line straight after the first curly bracket.", "Go to part 2.", "#cw/04/2-1"),
     have("1-1.t3", "Run it. Leave every box empty and press Enter. Does one message list what is missing?",
          "Use the green Start arrow. Log in first, then press Enter.", "Go to part 3.", "#cw/04/3-1"),
     have("1-1.t4", "Fill in all four and press Enter. Does the details panel go grey and the attempts panel wake up?",
          "Grey means switched off. Its boxes cannot be clicked.", "Go to part 3, screen 4.", "#cw/04/3-4")]}
   ]}]},
  {"id": "2", "title": "Collect every problem", "thing": "the four checks", "verb": "making", "screens": [
   opener("Make the Enter button check the four boxes", "This part gives the Enter button four checks. Each one adds a line to a list called errors.",
           "The Enter button looks at each box in turn. Every problem it finds is added to the end of errors.",
           "When it works, errors holds one line for every box that is wrong. Nothing is shown yet."),
   {"id": "1", "title": "Open the code behind the Enter button", "foot": "done", "done": "the code tab is open at btnEnter_Click with your cursor between its curly brackets",
    "goal": "I open the code behind the Enter button and meet the six new things in this chapter.",
    "blocks": [
    {"p": "The Enter button checks four things, and a pupil could get several of them wrong."},
    {"p": "So the code collects every problem first. Then it shows them all in one message."},
    {"words": [
      ["string.IsNullOrWhiteSpace", "Is this box empty, or only spaces?", "2-3", True],
      ["||", "Or. Only one side needs to be true.", "2-3", True],
      ["+=", "Add this on to the end.", "2-3", True],
      ["\\n", "Start a new line.", "2-3", True],
      [".SelectedIndex == -1", "Nothing is chosen in the drop-down list yet.", "2-4", True],
      ["Enabled = false", "Switch it off. It goes grey and cannot be clicked.", "3-4", True]],
     "intro": "Six new things in this chapter. Click any marked word to see what it means."},
    {"steps": [step("2-1.1", "In the Design tab, double-click the Enter button.", "The code tab opens at btnEnter_Click.")]},
   ]},
   {"id": "2", "title": "Start an empty list of problems", "foot": "done", "done": "lines 3 to 3 are typed and the code has no red squiggles",
    "goal": "The Enter button starts with an empty string called errors, so every problem found can be added to it.",
    "blocks": [
    {"p": "The first line of code makes errors, an empty string that every check adds to."},
    code("2-1.c1", "The Enter button: code 1 of 6", "between the curly brackets of btnEnter_Click, in frmDataEntry.cs", D, M, 1, 4,
         [given(1, 2),
          [3, 4, "An empty list of problems", "errors holds words. It starts with nothing in it. Each problem found is added to it."]],
         ["errors"], ["string"]),
    {"watch": "The errors line goes first. Every check below adds to it."}
   ]},
   {"id": "3", "title": "Add a problem when a name box is empty", "foot": "done", "done": "lines 5 to 9 are typed and the code has no red squiggles",
    "goal": "If the surname box or the first name box is empty, a line saying so is added to errors.",
    "blocks": [
    {"p": "The first check asks: is either name box empty?"},
    {"p": "[[string.IsNullOrWhiteSpace|0]] asks if a box is empty or holds only spaces. [[|||1]] means or."},
    {"p": "[[+=|2]] adds a line on to the end of errors. [[\\n|3]] starts that line on a new line."},
    code("2-2.c1", "The Enter button: code 2 of 6", "under code 1, " + IN, D, M, 5, 9,
         [[5, 6, "Is a name box empty?", "Is the surname box empty, OR is the first name box empty?"],
          [7, 9, "Add the problem", "A note for you, then a new line is added to errors."]],
         ["tbxSurname", "tbxFirstName", "errors"], ["tbxSurname"]),
    {"watch": "Two straight lines make or. The key is next to Z on most keyboards. Hold Shift."}
   ]},
   {"id": "4", "title": "Add a problem for long names or nothing chosen", "foot": "done", "done": "lines 10 to 18 are typed and the code has no red squiggles",
    "goal": "A name over 20 letters adds a too long line, and an empty drop-down list adds a must select line.",
    "blocks": [
    {"p": "Two more checks come next: a name too long, and a list with nothing chosen."},
    {"p": "[[.SelectedIndex == -1|4]] asks if nothing is chosen. -1 means nothing is chosen yet."},
    code("2-3.c1", "The Enter button: code 3 of 6", "under code 2, " + IN, D, M, 10, 18,
         [[10, 13, "Too long?", "Is either name more than 20 letters? If so, add a line to errors."],
          [14, 18, "Nothing chosen?", "Is nothing chosen for year group OR gender? A note, then a line is added."]],
         ["tbxSurname", "tbxFirstName", "cbxYeargroup", "cbxGender", "errors"], ["cbxYeargroup"],
         yours="MY longest name is 20 letters. Use the number YOUR task sheet gives."),
    {"watch": "Leave the spelling mistakes in the notes. The computer skips notes."}
   ]}]},
  {"id": "3", "title": "Show the problems or keep the details", "thing": "the message and the switch", "verb": "making", "screens": [
   opener("Show the problems, or keep the details and move on", "This part shows every problem in one message. With no problems, it keeps the details and switches panels.",
           "If errors holds anything, one message box shows it all. Otherwise the four details go into Global.cs.",
           "When it works, a wrong form shows one message. A right form goes grey and the attempts panel wakes up."),
   {"id": "1", "title": "Show every problem in one message", "foot": "done", "done": "lines 19 to 22 are typed and the code has no red squiggles",
    "goal": "If errors has anything in it, one message box shows every problem found.",
    "blocks": [
    {"p": "Every check is done now, so if errors holds anything there was a problem."},
    {"p": "errors.Length counts its characters. More than 0 means something was added."},
    code("3-1.c1", "The Enter button: code 4 of 6", "under code 3, " + IN, D, M, 19, 22,
         [[19, 22, "Any problems? Show them", "If errors is not empty, a message box shows every line in it."]],
         ["errors"], ["string"]),
    {"watch": "There is one message box, not three. It shows every problem at once."}
   ]},
   {"id": "2", "title": "Keep the four details in Global.cs", "foot": "done", "done": "lines 23 to 29 are typed and the code has no red squiggles",
    "goal": "With no problems, the surname, first name, gender and year group each go into their line in Global.cs.",
    "blocks": [
    {"p": "else runs when errors is empty, which means every box was filled in right."},
    {"p": "So the four details are kept in Global.cs. That is the file you made in chapter 3. Every form can read it."},
    code("3-2.c1", "The Enter button: code 5 of 6", "under code 4, " + IN, D, M, 23, 29,
         [[23, 25, "No problems", "else, then a note for you."],
          [26, 29, "Keep the four details", "Each one goes into its line in Global.cs."]],
         ["Global.surname", "tbxSurname", "Global.firstname", "tbxFirstName", "Global.gender", "cbxGender", "Global.yearGroup", "cbxYeargroup"], ["Global.surname"]),
    {"watch": "else opens with a curly bracket here. Its closing curly bracket comes in code 6."}
   ]},
   {"id": "3", "title": "See which panels switch when Enter is pressed", "foot": "done", "done": "you have watched the panels switch and read the line under the picture",
    "goal": "I watch the details panel switch off and the attempts panel switch on.",
    "blocks": [
    {"p": "Last, the Enter button moves the pupil on to the attempts panel."},
    {"flow": {"watch": "Watch the details panel go grey as the attempts panel wakes up", "labels": DL, "form": D, "lit": ["pnlPupilDetails"], "then": ["pnlSwimLengths"], "keep": False,
              "before": "The details are filled in right. Enter is pressed.",
              "say": "The details panel goes grey. The attempts panel wakes up."}},
   ]},
   {"id": "4", "title": "Switch the panels over in code", "foot": "done", "done": "lines 30 and 31 are typed and the code has no red squiggles",
    "goal": "After the details are kept, the attempts panel switches on and the details panel switches off.",
    "blocks": [
    {"p": "[[Enabled = false|5]] switches a panel off, and Enabled = true switches it on."},
    code("3-3.c1", "The Enter button: code 6 of 6", "under code 5, inside the else of btnEnter_Click", D, M, 30, 34,
         [[30, 31, "Move to the next panel", "The attempts panel switches on. The details panel switches off."],
          given(32, 34)],
         ["pnlSwimLengths", "pnlPupilDetails"], ["pnlSwimLengths"])
   ]}]},
  {"id": "4", "title": "Try your Enter button", "thing": "your Enter button", "verb": "testing", "screens": [
   {"id": "1", "title": "Try every way through the Enter button", "foot": "chapter-done", "done": "every row is ticked, or you have gone where its link says",
    "goal": "I run the program and try empty boxes, a long surname, all four filled in, and typing in the grey panel.",
    "blocks": [
    {"p": "Run your program, log in, then try each row and follow any failed row's link."},
    {"check": [
     tryit("4-1.t1", "Leave every box empty and press Enter.",
           "One message lists every missing thing, each on its own line.", "Look at the code on screens 2-3 and 2-4.", "#cw/04/2-3"),
     tryit("4-1.t2", "Type a surname of 21 letters. Fill in the rest. Press Enter.",
           "The message says the name is too long.", "Look at the code on screen 2-4.", "#cw/04/2-4"),
     tryit("4-1.t3", "Fill in all four and press Enter.",
           "The details panel goes grey. The attempts panel can be clicked.", "Look at the code on screen 3-4.", "#cw/04/3-4"),
     tryit("4-1.t4", "After that, click in the surname box and try to type.",
           "You must NOT be able to type in it.", "If you can, look at the code on screen 3-4.", "#cw/04/3-4", neg=True)]}
   ]}]}
 ]}
