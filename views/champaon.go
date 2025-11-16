package views

type CreateCampaignRequest struct {
	CampaignName string `json:"campaign_name"`
	Subject      string `json:"subject"`
	Body         string `json:"body"`
	Footer       string `json:"footer"`
}
