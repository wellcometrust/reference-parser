import unittest

from deep_reference_parser.split_section import SplitSection
from reach.refparse.refparse import SectionedDocument


class TestSplit(unittest.TestCase):

    def setUp(self):
        section_splitter = SplitSection()

    def test_empty_sections(self):
        references = self.section_splitter.split(" ")
        self.assertEqual(references, [], "Should be []")

    def test_oneline_section(self):
        references = section_splitter.split("Smith et al. 2019. This is a title. Journal of journals. 1-2")
        self.assertEqual(
            len(references),
            1,
            "There should be 1 reference found"
        )

    def test_empty_lines_section(self):
        references = section_splitter.split("\n\n\n")
        self.assertEqual(references, [], "Should be []")

    def test_normal_section(self):
        references = section_splitter.split(
            "References \n1. Smith et al. 2019. This is a title. Journal of journals. 1-2. "+
            "\n2. Smith et al. 2019. This is a title. Journal of journals. 1-2. "+
            "\n3. Smith et al. 2019. This is a title. Journal of journals. 1-2."
        )
        self.assertEqual(
            len(references),
            3,
            "There should be 3 references found"
        )
