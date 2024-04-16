interface Info {
	action?: string,
	date?: string,
	ip?: string,
	userAgent?: string
}

export default function getMailHTML(content: string, info?: Info) {
	return `
		<div style="font-family: sans-serif; line-height: 1.5em; color: #333;">			
			<h1 style="text-align: center; color: #333;">
				Phraser support
			</h1>
			<div style="width: 256px; height: 256px; margin: 25px auto;">
				<img src="https://phraser.s3.eu-north-1.amazonaws.com/icon.png" width="256px" height="256px" style="border-radius: 4px;" />
			</div>
			<p style="color: #333; text-align: center;">
				${content}
			</p>
			${
				info
				?
				`
				<div style="max-width: 500px; margin: 40px auto 10px auto; border: solid #555 1px; border-radius: 4px; padding: 5px 15px 15px 15px; background-color: #f5f5f5;">
					<h2 style="text-align: center;">
						Info
					</h2>
					${
						info.action
						?
						`
						<p style="text-align: center;">
							Action: ${info.action}
						</p>
						`
						:
						""
					}
					${
						info.date
						?
						`
						<p style="text-align: center;">
							Date: ${info.date}
						</p>
						`
						:
						""
					}
					${
						info.ip
						?
						`
						<p style="text-align: center;">
							IP address: ${info.ip}
						</p>
						`
						:
						""
					}
					${
						info.userAgent
						?
						`
						<p style="text-align: center;">
							User agent: ${info.userAgent}
						</p>
						`
						:
						""
					}
				</div>
				`
				:
				""
			}
		</div>
	`
}