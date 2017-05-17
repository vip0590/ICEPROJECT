
function myChart(win,draw,loss)
{
	var ctx = document.getElementById("myChart");
	var data = {
		labels: [
			"Win",
			"Draw",
			"Lost"
		],
		datasets: [
			{
				data: [win, draw, loss],
				backgroundColor: [
					"#FF6384",
					"#36A2EB",
					"#FFCE56"
				],
				hoverBackgroundColor: [
					"#FF6384",
					"#36A2EB",
					"#FFCE56"
				]
			}]
	};
	var myChart = new Chart(ctx, {
		type: 'doughnut',
		data: data
	});
}
