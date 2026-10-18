from app.seed.community_content import load_community_content, seed_community_content


class FakeResult:
    def consume(self):
        return None


class FakeSession:
    def __init__(self):
        self.calls = []

    def run(self, query, **parameters):
        self.calls.append((query, parameters))
        return FakeResult()


def test_community_fixture_is_fictional_and_has_valid_references():
    content = load_community_content()
    expected_counts = {
        "profiles": 52,
        "stories": 26,
        "opportunities": 26,
        "posts": 15,
    }

    assert {key: len(content[key]) for key in expected_counts} == expected_counts
    for key in expected_counts:
        records = content[key]
        ids = [record["id"] for record in records]
        assert len(ids) == len(set(ids))
        assert all(record["fictional"] is True for record in records)

    profile_ids = {profile["id"] for profile in content["profiles"]}
    opportunity_ids = {opportunity["id"] for opportunity in content["opportunities"]}
    assert all(story["authorPersonId"] in profile_ids for story in content["stories"])
    assert all(story["relatedOpportunityId"] in opportunity_ids for story in content["stories"])
    assert all(post["authorPersonId"] in profile_ids for post in content["posts"])
    assert all(post["status"] == "development-only" for post in content["posts"])
    assert all(opportunity["applicationUrl"] is None for opportunity in content["opportunities"])
    assert all(opportunity["deadline"] is None for opportunity in content["opportunities"])


def test_seed_merges_all_community_content_with_fictional_provenance():
    session = FakeSession()

    counts = seed_community_content(session)

    assert counts == {
        "profiles": 52,
        "stories": 26,
        "opportunities": 26,
        "posts": 15,
    }
    assert len(session.calls) == 4
    for query, _ in session.calls:
        assert "MERGE" in query
        assert "data_origin = 'fictional_development'" in query
